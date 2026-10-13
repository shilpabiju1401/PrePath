package com.preppath;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class PrepPathApplication {

    public static void main(String[] args) {
        // Automatically load .env file if it exists, setting properties into System env
        try {
            File envFile = new File(".env");
            if (envFile.exists()) {
                Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
                dotenv.entries().forEach(entry -> {
                    if (System.getProperty(entry.getKey()) == null) {
                        System.setProperty(entry.getKey(), entry.getValue());
                    }
                });
            }
        } catch (Exception ignored) {
            // Fallback to standard environment variables
        }

        SpringApplication.run(PrepPathApplication.class, args);
    }
}
