-- ================================================================
-- PrepPath V4 Migration: Seed Coding Topics, Problems & Test Cases
-- ================================================================

-- 1. Insert Coding Topics into 'topics' table under category 4 (Programming & DSA)
INSERT INTO topics (id, category_id, name, description, sequence_order, learning_content) VALUES
(101, 4, 'Variables & I/O', 'Basics of standard input, output and data types.', 1, 'Learn how to read and write data in C, Java, and Python.'),
(102, 4, 'Loops & Conditions', 'Conditional statements and iterations.', 2, 'Learn if-else and for/while loops.'),
(103, 4, 'Arrays & Vectors', 'Contiguous memory structures and common operations.', 3, 'Learn traversing, searching, and updating elements in arrays.'),
(104, 4, 'Strings & Characters', 'String manipulation and ASCII techniques.', 4, 'Learn string traversal, reversals, and palindromes.');

-- 2. Seed Coding Problems
INSERT INTO coding_problems (id, topic_id, title, statement, constraints, difficulty, sample_input, sample_output, starter_code_c, starter_code_java, starter_code_python, hints) VALUES
(1, 101, 'Sum of Two Numbers', 
'Write a program that takes two integers from standard input and prints their sum.', 
'-10^9 <= a, b <= 10^9', 
'EASY', 
'3 5', 
'8', 
'#include <stdio.h>\n\nint main() {\n    long long a, b;\n    if (scanf("%lld %lld", &a, &b) == 2) {\n        printf("%lld\\n", a + b);\n    }\n    return 0;\n}', 
'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        System.out.println(a + b);\n    }\n}', 
'import sys\n\ndef main():\n    lines = sys.stdin.read().split()\n    if len(lines) >= 2:\n        a, b = int(lines[0]), int(lines[1])\n        print(a + b)\n\nif __name__ == "__main__":\n    main()', 
'Read two tokens from stdin, convert to integers, and print their addition.'),

(2, 102, 'Even or Odd Counter', 
'Given N followed by N integers, count and print how many numbers are even and how many are odd separated by space.', 
'1 <= N <= 10^5', 
'EASY', 
'5\n1 2 3 4 5', 
'2 3', 
'#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int even = 0, odd = 0;\n    for(int i = 0; i < n; i++) {\n        int x;\n        scanf("%d", &x);\n        if(x % 2 == 0) even++; else odd++;\n    }\n    printf("%d %d\\n", even, odd);\n    return 0;\n}', 
'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int even = 0, odd = 0;\n        for(int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            if (x % 2 == 0) even++; else odd++;\n        }\n        System.out.println(even + " " + odd);\n    }\n}', 
'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data: return\n    n = int(data[0])\n    nums = [int(x) for x in data[1:n+1]]\n    evens = sum(1 for x in nums if x % 2 == 0)\n    odds = len(nums) - evens\n    print(f"{evens} {odds}")\n\nif __name__ == "__main__":\n    main()', 
'Use a loop and check if x % 2 == 0.'),

(3, 103, 'Find Maximum Element', 
'Find the maximum element in an array of N integers.', 
'1 <= N <= 10^5', 
'MEDIUM', 
'5\n10 45 2 89 34', 
'89', 
'#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    long long maxVal = -1e18;\n    for(int i = 0; i < n; i++) {\n        long long x;\n        scanf("%lld", &x);\n        if(x > maxVal) maxVal = x;\n    }\n    printf("%lld\\n", maxVal);\n    return 0;\n}', 
'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long max = Long.MIN_VALUE;\n        for (int i = 0; i < n; i++) {\n            long x = sc.nextLong();\n            if (x > max) max = x;\n        }\n        System.out.println(max);\n    }\n}', 
'import sys\n\ndef main():\n    nums = [int(x) for x in sys.stdin.read().split()]\n    if len(nums) > 1:\n        print(max(nums[1:]))\n\nif __name__ == "__main__":\n    main()', 
'Iterate through the elements keeping track of the highest value seen so far.');

-- 3. Seed Test Cases
INSERT INTO coding_test_cases (problem_id, input, expected_output, is_hidden) VALUES
(1, '3 5', '8', false),
(1, '100 -20', '80', false),
(1, '0 0', '0', true),
(1, '-50 -50', '-100', true),

(2, '5\n1 2 3 4 5', '2 3', false),
(2, '4\n2 4 6 8', '4 0', true),

(3, '5\n10 45 2 89 34', '89', false),
(3, '3\n-5 -2 -9', '-2', true);
