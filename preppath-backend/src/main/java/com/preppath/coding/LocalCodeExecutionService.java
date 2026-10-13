package com.preppath.coding;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * LocalCodeExecutionService — securely compiles and executes user code
 * using the local Python, Java, and GCC compilers installed on the machine.
 * Captures genuine stdout, stderr, compile errors, runtime errors, and execution time.
 */
@Service
public class LocalCodeExecutionService {

    private static final long TIMEOUT_SECONDS = 7;

    public Judge0Service.ExecutionResult executeLocally(String language, String code, String stdin) {
        String lang = language != null ? language.toLowerCase().trim() : "python";
        if (lang.contains("python")) {
            return runPython(code, stdin);
        } else if (lang.contains("java")) {
            return runJava(code, stdin);
        } else if (lang.contains("c")) {
            return runC(code, stdin);
        } else {
            return runPython(code, stdin);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // PYTHON EXECUTION
    // ─────────────────────────────────────────────────────────────
    private Judge0Service.ExecutionResult runPython(String code, String stdin) {
        String pythonCmd = resolvePythonCmd();
        if (pythonCmd == null) {
            Judge0Service.ExecutionResult res = new Judge0Service.ExecutionResult();
            res.status = "COMPILATION_ERROR";
            res.compileOutput = "Python 3 is not installed on this server environment.\n\n"
                    + "💡 Fix: If you are hosting on Render, deploy with 'Docker' using our updated Dockerfile so Python 3 is pre-installed automatically, or add a free Judge0 API key.";
            res.time = 0.0;
            return res;
        }

        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("pp_py_");
            Path scriptFile = tempDir.resolve("script.py");
            Files.writeString(scriptFile, code, StandardCharsets.UTF_8);

            ProcessBuilder pb = new ProcessBuilder(pythonCmd, scriptFile.toAbsolutePath().toString());
            pb.directory(tempDir.toFile());

            return executeProcess(pb, stdin);
        } catch (Exception e) {
            Judge0Service.ExecutionResult res = new Judge0Service.ExecutionResult();
            res.status = "RUNTIME_ERROR";
            res.stderr = "Execution failed: " + e.getMessage();
            res.time = 0.0;
            return res;
        } finally {
            cleanupDir(tempDir);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // JAVA EXECUTION
    // ─────────────────────────────────────────────────────────────
    private Judge0Service.ExecutionResult runJava(String code, String stdin) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("pp_java_");

            // Extract public class name or default to Main
            String className = extractJavaClassName(code);
            Path sourceFile = tempDir.resolve(className + ".java");
            Files.writeString(sourceFile, code, StandardCharsets.UTF_8);

            // If javac is available, compile then run; otherwise use Java 11+ single-file execution: java Source.java
            if (isCommandAvailable("javac")) {
                long startTime = System.currentTimeMillis();
                ProcessBuilder compilePb = new ProcessBuilder("javac", sourceFile.toAbsolutePath().toString());
                compilePb.directory(tempDir.toFile());
                Process compileProc = compilePb.start();

                String compileErr = readStream(compileProc.getErrorStream());
                boolean compiled = compileProc.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

                if (!compiled || compileProc.exitValue() != 0) {
                    Judge0Service.ExecutionResult res = new Judge0Service.ExecutionResult();
                    res.status = "COMPILATION_ERROR";
                    res.compileOutput = !compileErr.isEmpty() ? compileErr : "Java compilation timed out or failed.";
                    res.time = (System.currentTimeMillis() - startTime) / 1000.0;
                    return res;
                }

                // Run compiled bytecode
                ProcessBuilder runPb = new ProcessBuilder("java", "-cp", tempDir.toAbsolutePath().toString(), className);
                runPb.directory(tempDir.toFile());
                return executeProcess(runPb, stdin);
            } else {
                // Java 11+ single-file source-code launcher (works on bare JRE without javac!)
                ProcessBuilder runPb = new ProcessBuilder("java", sourceFile.toAbsolutePath().toString());
                runPb.directory(tempDir.toFile());
                return executeProcess(runPb, stdin);
            }
        } catch (Exception e) {
            Judge0Service.ExecutionResult res = new Judge0Service.ExecutionResult();
            res.status = "RUNTIME_ERROR";
            res.stderr = "Java execution error: " + e.getMessage();
            res.time = 0.0;
            return res;
        } finally {
            cleanupDir(tempDir);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // C EXECUTION (GCC)
    // ─────────────────────────────────────────────────────────────
    private Judge0Service.ExecutionResult runC(String code, String stdin) {
        String gccCmd = resolveGccPath();
        if (gccCmd == null) {
            Judge0Service.ExecutionResult res = new Judge0Service.ExecutionResult();
            res.status = "COMPILATION_ERROR";
            res.compileOutput = "GCC (C compiler) is not installed on this server environment.\n\n"
                    + "💡 Fix: If you are hosting on Render, deploy with 'Docker' using our updated Dockerfile so GCC is pre-installed automatically, or add a free Judge0 API key.";
            res.time = 0.0;
            return res;
        }

        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("pp_c_");
            Path sourceFile = tempDir.resolve("main.c");
            Path exeFile = tempDir.resolve(isWindows() ? "main.exe" : "main.out");
            Files.writeString(sourceFile, code, StandardCharsets.UTF_8);

            long startTime = System.currentTimeMillis();

            // 1. Compile with GCC
            ProcessBuilder compilePb = new ProcessBuilder(gccCmd, sourceFile.toAbsolutePath().toString(), "-o", exeFile.toAbsolutePath().toString());
            compilePb.directory(tempDir.toFile());
            Process compileProc = compilePb.start();

            String compileErr = readStream(compileProc.getErrorStream());
            boolean compiled = compileProc.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            if (!compiled || compileProc.exitValue() != 0 || !Files.exists(exeFile)) {
                Judge0Service.ExecutionResult res = new Judge0Service.ExecutionResult();
                res.status = "COMPILATION_ERROR";
                res.compileOutput = !compileErr.isEmpty() ? compileErr : "C compilation failed.";
                res.time = (System.currentTimeMillis() - startTime) / 1000.0;
                return res;
            }

            // 2. Run compiled executable
            ProcessBuilder runPb = new ProcessBuilder(exeFile.toAbsolutePath().toString());
            runPb.directory(tempDir.toFile());
            return executeProcess(runPb, stdin);
        } catch (Exception e) {
            Judge0Service.ExecutionResult res = new Judge0Service.ExecutionResult();
            res.status = "RUNTIME_ERROR";
            res.stderr = "C execution error: " + e.getMessage();
            res.time = 0.0;
            return res;
        } finally {
            cleanupDir(tempDir);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // COMMON PROCESS RUNNER
    // ─────────────────────────────────────────────────────────────
    private Judge0Service.ExecutionResult executeProcess(ProcessBuilder pb, String stdin) throws IOException, InterruptedException {
        Judge0Service.ExecutionResult res = new Judge0Service.ExecutionResult();
        long startTime = System.currentTimeMillis();

        Process process = pb.start();

        // Write stdin if provided
        if (stdin != null && !stdin.isEmpty()) {
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8))) {
                writer.write(stdin);
                writer.newLine();
                writer.flush();
            } catch (IOException ignored) {}
        } else {
            try {
                process.getOutputStream().close();
            } catch (IOException ignored) {}
        }

        // Wait with timeout
        boolean finished = process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);
        double elapsed = (System.currentTimeMillis() - startTime) / 1000.0;
        res.time = Math.round(elapsed * 1000.0) / 1000.0;

        if (!finished) {
            process.destroyForcibly();
            res.status = "TIME_LIMIT_EXCEEDED";
            res.stderr = "Time Limit Exceeded: Process took longer than " + TIMEOUT_SECONDS + " seconds. Make sure your loops terminate and you aren't waiting indefinitely for input.";
            return res;
        }

        String stdout = readStream(process.getInputStream());
        String stderr = readStream(process.getErrorStream());

        res.stdout = stdout;
        res.stderr = stderr.isEmpty() ? null : stderr;

        if (process.exitValue() == 0) {
            res.status = "ACCEPTED";
        } else {
            res.status = "RUNTIME_ERROR";
            if (res.stderr == null || res.stderr.isBlank()) {
                res.stderr = "Process exited with non-zero exit code: " + process.exitValue();
            }
        }

        return res;
    }

    private String readStream(InputStream is) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            return sb.toString().trim();
        }
    }

    private String extractJavaClassName(String code) {
        Pattern pattern = Pattern.compile("public\\s+class\\s+([A-Za-z0-9_]+)");
        Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "Main";
    }

    private String resolvePythonCmd() {
        if (isCommandAvailable("python3")) return "python3";
        if (isCommandAvailable("python")) return "python";
        if (isCommandAvailable("py")) return "py";
        if (new File("/usr/bin/python3").exists()) return "/usr/bin/python3";
        if (new File("/usr/local/bin/python3").exists()) return "/usr/local/bin/python3";
        if (new File("/usr/bin/python").exists()) return "/usr/bin/python";
        return null;
    }

    private String resolveGccPath() {
        if (isCommandAvailable("gcc")) return "gcc";
        if (new File("C:\\MinGW\\bin\\gcc.exe").exists()) return "C:\\MinGW\\bin\\gcc.exe";
        if (new File("/usr/bin/gcc").exists()) return "/usr/bin/gcc";
        if (new File("/usr/local/bin/gcc").exists()) return "/usr/local/bin/gcc";
        return null;
    }

    private boolean isWindows() {
        String os = System.getProperty("os.name");
        return os != null && os.toLowerCase().contains("win");
    }

    private boolean isCommandAvailable(String cmd) {
        try {
            Process p = new ProcessBuilder(cmd, "--version").start();
            return p.waitFor(2, TimeUnit.SECONDS) && p.exitValue() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private void cleanupDir(Path dir) {
        if (dir == null) return;
        try {
            Files.walk(dir)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        } catch (Exception ignored) {}
    }
}
