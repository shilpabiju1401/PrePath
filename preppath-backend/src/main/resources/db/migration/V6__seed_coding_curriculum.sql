-- ================================================================
-- PrepPath V6 Migration: Seed Level 1 & Level 2 Coding Topics
-- ================================================================

-- ────────────────────────────────────────────
-- Level 1: Programming Basics (Topics 1 to 8)
-- ────────────────────────────────────────────
INSERT INTO coding_topics (id, level_number, name, sequence_order, summary) VALUES
(1, 1, 'Variables & Data Types', 1, 'Understand how computers store values in memory using labeled boxes.'),
(2, 1, 'Operators & Expressions', 2, 'Learn arithmetic, relational, and logical operators to calculate values.'),
(3, 1, 'Input & Output', 3, 'Read data from standard input and print output to the terminal.'),
(4, 1, 'Conditions (if/else)', 4, 'Make decisions in code based on truth conditions.'),
(5, 1, 'Loops (for & while)', 5, 'Repeat actions multiple times efficiently without duplicate code.'),
(6, 1, 'Functions', 6, 'Organize reusable blocks of code that take inputs and return results.'),
(7, 1, 'Basic Patterns', 7, 'Build nested loop logic to print stars, numbers, and triangles.');

-- ────────────────────────────────────────────
-- Level 2: Core DSA (Topics 8 to 13)
-- ────────────────────────────────────────────
INSERT INTO coding_topics (id, level_number, name, sequence_order, summary) VALUES
(8, 2, 'Arrays', 1, 'Contiguous blocks of memory for storing sequences of elements.'),
(9, 2, 'Strings', 2, 'Sequences of characters and string manipulation algorithms.'),
(10, 2, 'Linear & Binary Search', 3, 'Techniques to find elements inside arrays with optimal time.'),
(11, 2, 'Basic Sorting', 4, 'Bubble Sort, Selection Sort, and Insertion Sort explained visually.'),
(12, 2, 'Time & Space Complexity', 5, 'Big-O notation and how to analyze algorithm efficiency.'),
(13, 2, 'Basic Recursion', 6, 'Functions calling themselves to solve smaller subproblems.');

-- ────────────────────────────────────────────
-- Topic 1: Variables & Data Types SECTIONS
-- ────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(1, 'ANALOGY', 'Real-Life Analogy: The Labeled Storage Box', 
'Imagine you have a moving box. You write a label on it: **"books"**. Inside, you put 5 books.

In programming:
- The **Box** is memory in the computer.
- The **Label** ("books") is the **Variable Name**.
- The **Contents** (5) is the **Value**.
- The **Type of Box** (e.g. only holds whole numbers, or text) is the **Data Type**.

When you write `int books = 5;`, you tell the computer: *"Reserve a box named books, which holds integers, and put 5 inside!"*', 1),

(1, 'CONCEPT', 'Fundamental Data Types',
'Every variable has a type that dictates what kind of data it holds:
- **Integer (`int`)**: Whole numbers without decimals (e.g., `-5`, `0`, `42`).
- **Floating Point (`float`, `double`)**: Numbers with fractional parts (e.g., `3.14`, `-0.01`).
- **Character (`char`)**: Single letters or symbols inside single quotes (e.g., `''A''`, `''$''`).
- **Boolean (`bool` / `boolean`)**: Either `true` or `false`.
- **String**: Sequences of text inside double quotes (e.g., `"Hello, World!"`).', 2),

(1, 'MISTAKES', 'Common Beginner Mistakes & Tips',
'1. **Using before declaring**: Trying to use a variable before creating it.
2. **Type mismatch**: Trying to store `"apple"` in an `int` variable.
3. **Variable name rules**: Names cannot start with a digit (e.g., `2count` is invalid, use `count2`).
4. **Case sensitivity**: `myScore` and `myscore` are two completely different variables in C, Java, and Python!', 3),

(1, 'SUMMARY', 'Key Takeaways',
'• A variable is a named memory location that stores a value.
• Statically typed languages (C, Java) require declaring the type upfront (`int x = 10;`).
• Dynamically typed languages (Python) infer the type automatically (`x = 10`).
• Always choose clear, descriptive names for your variables (`totalScore` instead of `x`).', 4);

-- Topic 1 CODE EXAMPLES
INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(1, 'python', 'Declaring and Updating Variables in Python',
'# Create variables
age = 20
gpa = 3.85
name = "PrepPath Student"
is_enrolled = True

print("Name:", name)
print("Age next year:", age + 1)
print("GPA:", gpa)',
'Line 1-4: Python automatically detects integer, float, string, and boolean types.
Line 6-8: Print statements format and output the stored values.',
'Name: PrepPath Student
Age next year: 21
GPA: 3.85', 1),

(1, 'java', 'Declaring and Updating Variables in Java',
'public class Main {
    public static void main(String[] args) {
        int age = 20;
        double gpa = 3.85;
        String name = "PrepPath Student";
        boolean isEnrolled = true;

        System.out.println("Name: " + name);
        System.out.println("Age next year: " + (age + 1));
        System.out.println("GPA: " + gpa);
    }
}',
'Line 3-6: Specify types (int, double, String, boolean) explicitly.
Line 8-10: System.out.println prints each line to standard output.',
'Name: PrepPath Student
Age next year: 21
GPA: 3.85', 2),

(1, 'c', 'Declaring and Updating Variables in C',
'#include <stdio.h>

int main() {
    int age = 20;
    float gpa = 3.85;
    char grade = ''A'';

    printf("Age: %d\\n", age);
    printf("Age next year: %d\\n", age + 1);
    printf("GPA: %.2f\\n", gpa);
    printf("Grade: %c\\n", grade);
    return 0;
}',
'Line 4-6: Declare int, float, and char types.
Line 8-11: printf uses format specifiers: %d for int, %.2f for float (2 decimal places), %c for char.',
'Age: 20
Age next year: 21
GPA: 3.85
Grade: A', 3);

-- Topic 1 INTERACTIVE VISUALIZATION
INSERT INTO topic_visualizations (topic_id, viz_type, steps_json) VALUES
(1, 'BOX', 
'[
  {"step": 1, "title": "Empty Box (Memory Allocated)", "caption": "Computer reserves a memory slot labeled \"score\". Currently it holds no value.", "data": {"label": "score", "value": "?", "highlight": false, "type": "int"}},
  {"step": 2, "title": "Assign Initial Value (score = 10)", "caption": "The value 10 is placed inside the box.", "data": {"label": "score", "value": "10", "highlight": true, "type": "int"}},
  {"step": 3, "title": "Update Value (score = score + 5)", "caption": "The CPU reads 10, calculates 10 + 5 = 15, and replaces the content with 15.", "data": {"label": "score", "value": "15", "highlight": true, "type": "int"}},
  {"step": 4, "title": "Final State", "caption": "The variable score now holds 15 until changed again.", "data": {"label": "score", "value": "15", "highlight": false, "type": "int"}}
]');

-- ────────────────────────────────────────────
-- Topic 8: Arrays (Level 2 Topic 1)
-- ────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(8, 'ANALOGY', 'Real-Life Analogy: The Train Compartment', 
'Imagine a train with compartments numbered 0, 1, 2, 3, 4.
Each compartment holds one passenger. Because they are physically linked together side-by-side, if you know where compartment 0 is, you can reach compartment 3 instantly in $O(1)$ time!

In computer memory:
- An **Array** is a contiguous block of consecutive slots.
- The **Index** starts at 0 (zero-indexed).
- Direct access: `arr[2]` jumps straight to the 3rd element without searching.', 1),

(8, 'CONCEPT', 'Core Array Characteristics',
'• **Fixed Size**: In C/Java, array size is fixed when created.
• **Contiguous Memory**: Elements sit right next to each other in RAM.
• **Zero-Indexed**: The first element is at index 0, last element at `length - 1`.
• **Fast Access**: Accessing `arr[i]` takes instant $O(1)$ constant time.', 2),

(8, 'MISTAKES', 'Common Pitfalls',
'1. **Array Index Out of Bounds**: Trying to access `arr[5]` on an array of length 5 (valid indices are 0 to 4!).
2. **Forgetting 0-indexing**: Thinking `arr[1]` is the first element (it is actually the second!).', 3),

(8, 'SUMMARY', 'Key Takeaways',
'• Arrays store multiple items of the same type in consecutive memory addresses.
• Lookup by index is $O(1)$ instant.
• Searching without sorting takes $O(N)$ linear time.', 4);

-- Topic 8 CODE EXAMPLES
INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(8, 'python', 'Iterating an Array (List) in Python',
'numbers = [10, 20, 30, 40, 50]

print("First element:", numbers[0])
print("Length:", len(numbers))

# Print all elements
for i in range(len(numbers)):
    print(f"Index {i} has value {numbers[i]}")',
'Line 1: Create a list with 5 integers.
Line 3: Access index 0 (10).
Line 7-8: Loop through each index from 0 to 4.',
'First element: 10
Length: 5
Index 0 has value 10
Index 1 has value 20
Index 2 has value 30
Index 3 has value 40
Index 4 has value 50', 1),

(8, 'java', 'Iterating an Array in Java',
'public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};

        System.out.println("First element: " + numbers[0]);
        System.out.println("Length: " + numbers.length);

        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Index " + i + " has value " + numbers[i]);
        }
    }
}',
'Line 3: Create an int array with 5 elements.
Line 7-9: Standard for-loop accessing numbers[i].',
'First element: 10
Length: 5
Index 0 has value 10
Index 1 has value 20
Index 2 has value 30
Index 3 has value 40
Index 4 has value 50', 2),

(8, 'c', 'Iterating an Array in C',
'#include <stdio.h>

int main() {
    int numbers[5] = {10, 20, 30, 40, 50};

    printf("First element: %d\\n", numbers[0]);

    for (int i = 0; i < 5; i++) {
        printf("Index %d has value %d\\n", i, numbers[i]);
    }
    return 0;
}',
'Line 4: Define an array of 5 integers.
Line 8-10: Loop through indices 0 to 4 using printf.',
'First element: 10
Index 0 has value 10
Index 1 has value 20
Index 2 has value 30
Index 3 has value 40
Index 4 has value 50', 3);

-- Topic 8 VISUALIZATION
INSERT INTO topic_visualizations (topic_id, viz_type, steps_json) VALUES
(8, 'ARRAY',
'[
  {"step": 1, "title": "Array in Memory", "caption": "An array of 5 integers stored contiguously at indices 0, 1, 2, 3, 4.", "data": {"items": [10, 20, 30, 40, 50], "activeIdx": -1}},
  {"step": 2, "title": "Traverse Index 0", "caption": "Pointer at index 0. Value is 10.", "data": {"items": [10, 20, 30, 40, 50], "activeIdx": 0}},
  {"step": 3, "title": "Traverse Index 1", "caption": "Pointer moves to index 1. Value is 20.", "data": {"items": [10, 20, 30, 40, 50], "activeIdx": 1}},
  {"step": 4, "title": "Traverse Index 2", "caption": "Pointer at index 2. Value is 30.", "data": {"items": [10, 20, 30, 40, 50], "activeIdx": 2}},
  {"step": 5, "title": "Traverse Index 3", "caption": "Pointer at index 3. Value is 40.", "data": {"items": [10, 20, 30, 40, 50], "activeIdx": 3}},
  {"step": 6, "title": "Traverse Index 4", "caption": "Pointer at last index 4. Value is 50. Traversal complete!", "data": {"items": [10, 20, 30, 40, 50], "activeIdx": 4}}
]');
