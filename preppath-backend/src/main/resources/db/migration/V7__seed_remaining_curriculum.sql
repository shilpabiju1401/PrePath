-- =============================================================
-- V7: Seed remaining Level 1 (topics 2-7) and Level 2 (topics 9-13)
-- Columns for topic_code_examples: topic_id, language, title, code, explanation, expected_output, sort_order
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- TOPIC 2: Operators
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(2, 'ANALOGY', 'What is an Operator?',
'Think of an operator like a **calculator button**. Just like pressing **+** on your calculator adds two numbers, operators in programming tell the computer what action to perform on values.

The values the operator works on are called **operands**. For example in `5 + 3`, the `+` is the operator and `5` and `3` are the operands.',
1),
(2, 'CONCEPT', 'Arithmetic Operators',
'Arithmetic operators perform **mathematical calculations**:

- **`+`** Addition — adds two values (e.g., `5 + 3` gives `8`)
- **`-`** Subtraction — subtracts the right from the left (e.g., `10 - 4` gives `6`)
- **`*`** Multiplication — multiplies two values (e.g., `3 * 4` gives `12`)
- **`/`** Division — divides the left by the right (e.g., `10 / 2` gives `5`)
- **`%`** Modulus — gives the **remainder** after division (e.g., `10 % 3` gives `1`)
- **`**`** Exponentiation — raises to a power (Python only, e.g., `2 ** 3` gives `8`)',
2),
(2, 'CONCEPT', 'Comparison Operators',
'Comparison operators **compare two values** and always return a Boolean (`true` or `false`):

- **`==`** Equal to — is `5 == 5`? Yes, `true`
- **`!=`** Not equal to — is `5 != 3`? Yes, `true`
- **`>`** Greater than — is `7 > 4`? Yes, `true`
- **`<`** Less than — is `3 < 1`? No, `false`
- **`>=`** Greater than or equal to
- **`<=`** Less than or equal to',
3),
(2, 'CONCEPT', 'Logical Operators',
'Logical operators combine multiple conditions:

- **`&&` / `and`** — AND: both conditions must be true
- **`||` / `or`** — OR: at least one condition must be true
- **`!` / `not`** — NOT: flips the result (true becomes false)

Example: `age >= 18 && hasID == true` means the person must be BOTH 18+ AND have an ID.',
4),
(2, 'CONCEPT', 'Assignment Operators',
'Assignment operators store values in variables:

- **`=`** — assign: `x = 10` puts the value 10 into x
- **`+=`** — add and assign: `x += 5` is the same as `x = x + 5`
- **`-=`** — subtract and assign
- **`*=`** — multiply and assign
- **`/=`** — divide and assign',
5),
(2, 'MISTAKES', 'Common Mistakes',
'- Confusing **`=`** (assignment) with **`==`** (comparison). Writing `if (x = 5)` instead of `if (x == 5)` is a very common bug.
- Integer division in C and Java: `5 / 2` gives `2`, not `2.5`. Use `5.0 / 2` or cast to float.
- Forgetting operator precedence: `2 + 3 * 4` is `14`, not `20`. Multiplication happens first. Use parentheses when in doubt: `(2 + 3) * 4` gives `20`.',
6),
(2, 'SUMMARY', 'Key Takeaways',
'- Arithmetic operators: `+`, `-`, `*`, `/`, `%`
- Comparison operators return `true` or `false`: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Logical operators combine conditions: `&&`, `||`, `!`
- Assignment operators update variables: `=`, `+=`, `-=`, `*=`
- **`=`** assigns, **`==`** compares — never mix them up!',
7);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(2, 'python', 'Arithmetic and Comparison Operators in Python',
'a = 15
b = 4
print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)
print("Modulus:", a % b)
print("Is a > b?", a > b)
print("Is a == b?", a == b)',
'We declare two variables a=15 and b=4. Each arithmetic operator is applied and printed. The last two lines show comparison results as True or False.',
'Addition: 19
Subtraction: 11
Multiplication: 60
Division: 3.75
Modulus: 3
Is a > b? True
Is a == b? False', 1),
(2, 'java', 'Arithmetic and Comparison Operators in Java',
'public class Main {
    public static void main(String[] args) {
        int a = 15, b = 4;
        System.out.println("Addition: " + (a + b));
        System.out.println("Division (int): " + (a / b));
        System.out.println("Division (float): " + ((double) a / b));
        System.out.println("Modulus: " + (a % b));
        System.out.println("Is a > b? " + (a > b));
    }
}',
'Notice that integer division a/b gives 3 (truncated). Casting one operand to double gives the true decimal result 3.75.',
'Addition: 19
Division (int): 3
Division (float): 3.75
Modulus: 3
Is a > b? true', 2),
(2, 'c', 'Arithmetic and Comparison Operators in C',
'#include <stdio.h>
int main() {
    int a = 15, b = 4;
    printf("Addition: %d\n", a + b);
    printf("Division (int): %d\n", a / b);
    printf("Division (float): %.2f\n", (float)a / b);
    printf("Modulus: %d\n", a % b);
    printf("Is a > b? %d\n", a > b);
    return 0;
}',
'In C, comparison operators return 1 for true and 0 for false. Integer division truncates; casting one operand to float gives the decimal result.',
'Addition: 19
Division (int): 3
Division (float): 3.75
Modulus: 3
Is a > b? 1', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(2, '[{"label":"Start","caption":"We have two boxes: a = 15 and b = 4.","boxes":[{"id":"a","label":"a","value":"15","highlight":false},{"id":"b","label":"b","value":"4","highlight":false}]},{"label":"a + b","caption":"Addition: 15 + 4 = 19. Result goes into a new box.","boxes":[{"id":"a","label":"a","value":"15","highlight":true},{"id":"b","label":"b","value":"4","highlight":true},{"id":"r","label":"result","value":"19","highlight":true}]},{"label":"a % b","caption":"Modulus: 15 divided by 4 = 3 remainder 3. The % operator gives us that remainder.","boxes":[{"id":"a","label":"a","value":"15","highlight":true},{"id":"b","label":"b","value":"4","highlight":true},{"id":"r","label":"result","value":"3","highlight":true}]},{"label":"a > b","caption":"Comparison: Is 15 greater than 4? Yes, true.","boxes":[{"id":"a","label":"a","value":"15","highlight":true},{"id":"b","label":"b","value":"4","highlight":true},{"id":"r","label":"result","value":"true","highlight":true}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 3: Input / Output
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(3, 'ANALOGY', 'What is Input and Output?',
'Imagine your program is a **vending machine**. You press buttons (input) and it gives you a snack (output). In programming:

- **Input** is data the user types or provides to the program
- **Output** is what the program displays back to the user',
1),
(3, 'CONCEPT', 'Output — Printing to the Screen',
'Every language has a way to display text:

- **Python**: `print("Hello")`
- **Java**: `System.out.println("Hello")`
- **C**: `printf("Hello\n")`

The `\n` in C and Java means **newline** — move to the next line. `println` in Java adds a newline automatically.',
2),
(3, 'CONCEPT', 'Input — Reading from the User',
'To read what the user types:

- **Python**: `name = input("Enter your name: ")` — reads a string. Use `int(input(...))` to read a number.
- **Java**: Create a `Scanner` object: `Scanner sc = new Scanner(System.in);` then `String name = sc.nextLine();` or `int n = sc.nextInt();`
- **C**: Use `scanf`: `scanf("%d", &n);` reads an integer. The `&` means "address of" — required for scanf.',
3),
(3, 'CONCEPT', 'Formatting Output',
'You often want to mix text and variable values in output:

- **Python f-string**: `print(f"Hello, {name}! You are {age} years old.")`
- **Java string concatenation**: `System.out.println("Hello, " + name + "!");`
- **C format specifiers**: `printf("You are %d years old.\n", age);`
  - `%d` for integers, `%f` for floats, `%s` for strings, `%c` for characters',
4),
(3, 'MISTAKES', 'Common Mistakes',
'- In Python, `input()` always returns a **string**. If you forget to convert: `age = int(input("Age: "))` — without `int()`, you cannot do math with it.
- In C, forgetting the `&` in `scanf("%d", n)` instead of `scanf("%d", &n)` causes a crash.
- In Java, forgetting `import java.util.Scanner;` at the top of your file causes a compile error.',
5),
(3, 'SUMMARY', 'Key Takeaways',
'- `print` / `println` / `printf` display output on screen
- `input()` / `Scanner` / `scanf` read input from the user
- `input()` in Python always gives a string — convert with `int()` or `float()` when needed
- Format output using f-strings (Python), `+` concatenation (Java), or `%d/%s` specifiers (C)',
6);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(3, 'python', 'Reading Input and Formatting Output in Python',
'name = input("Enter your name: ")
age = int(input("Enter your age: "))
print(f"Hello, {name}! Next year you will be {age + 1} years old.")',
'We read a string (name) and an integer (age). The f-string lets us embed variables directly in the output text. Note how int() converts the string from input() into a number.',
'Enter your name: Alice
Enter your age: 20
Hello, Alice! Next year you will be 21 years old.', 1),
(3, 'java', 'Reading Input and Formatting Output in Java',
'import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = sc.nextLine();
        System.out.print("Enter your age: ");
        int age = sc.nextInt();
        System.out.println("Hello, " + name + "! Next year: " + (age + 1));
    }
}',
'We create a Scanner connected to System.in (keyboard). nextLine() reads a full line of text; nextInt() reads an integer. String concatenation with + builds the output.',
'Enter your name: Alice
Enter your age: 20
Hello, Alice! Next year: 21', 2),
(3, 'c', 'Reading Input and Formatting Output in C',
'#include <stdio.h>
int main() {
    char name[50];
    int age;
    printf("Enter your name: ");
    scanf("%s", name);
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Hello, %s! Next year you will be %d.\n", name, age + 1);
    return 0;
}',
'In C we pre-declare a character array for the name. %s reads a string, %d reads an integer. The & before age is required by scanf.',
'Enter your name: Alice
Enter your age: 20
Hello, Alice! Next year you will be 21.', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(3, '[{"label":"User types","caption":"The user types Alice and presses Enter. This goes into the input buffer.","boxes":[{"id":"buf","label":"input buffer","value":"Alice","highlight":true}]},{"label":"input() reads","caption":"input() reads from the buffer and stores the string in variable name.","boxes":[{"id":"buf","label":"input buffer","value":"Alice","highlight":false},{"id":"name","label":"name","value":"Alice","highlight":true}]},{"label":"Processing","caption":"The program builds a greeting string using the name variable.","boxes":[{"id":"name","label":"name","value":"Alice","highlight":true},{"id":"out","label":"output","value":"Hello, Alice!","highlight":false}]},{"label":"print()","caption":"print() sends the result to the screen and the user sees the output.","boxes":[{"id":"out","label":"screen","value":"Hello, Alice!","highlight":true}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 4: Conditions (if / else)
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(4, 'ANALOGY', 'What are Conditions?',
'Think of a traffic light. **If** it is green, you go. **Else if** it is yellow, you slow down. **Else** you stop. Conditions let your program make decisions based on whether something is true or false.',
1),
(4, 'CONCEPT', 'if / else if / else',
'The basic structure is:

- Check a **condition** (something true or false)
- If true, run the **if block**
- If false, check the next condition (`else if`) or run the **else block**

Conditions use comparison operators: `>`, `<`, `==`, `!=`, `>=`, `<=`.',
2),
(4, 'CONCEPT', 'Python vs Java/C Syntax',
'**Python** uses indentation and a colon, no braces:
- `if score >= 90:` then indented block
- `elif score >= 70:` (elif, not else if)
- `else:`

**Java and C** use parentheses around the condition and curly braces around the block:
- `if (score >= 90) { ... }`
- `else if (score >= 70) { ... }`
- `else { ... }`',
3),
(4, 'CONCEPT', 'Combining Conditions',
'You can combine conditions with logical operators:

- `if (age >= 18 && hasID)` — must satisfy BOTH conditions
- `if (isWeekend || isHoliday)` — satisfies EITHER condition

You can also nest an `if` inside another `if` — just keep it shallow or your code becomes hard to read.',
4),
(4, 'MISTAKES', 'Common Mistakes',
'- Using `=` (assignment) instead of `==` (comparison) in a condition: `if (x = 5)` in Java/C assigns 5 to x instead of comparing.
- In Python, forgetting the colon `:` after `if condition:` gives a SyntaxError.
- Off-by-one: `if (score > 90)` excludes 90 itself. Use `>=` if 90 should pass.',
5),
(4, 'SUMMARY', 'Key Takeaways',
'- `if` checks a condition and runs its block if true
- `else if` / `elif` adds more conditions to check
- `else` runs when no condition matched
- Combine conditions with `&&` (and), `||` (or), `!` (not)
- Python uses indentation and colons; Java/C use parentheses and curly braces',
6);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(4, 'python', 'Grade Calculator using if/elif/else in Python',
'score = int(input("Enter your score: "))
if score >= 90:
    print("Grade: A — Excellent!")
elif score >= 75:
    print("Grade: B — Good job!")
elif score >= 50:
    print("Grade: C — Keep going!")
else:
    print("Grade: F — Study harder!")',
'Conditions are checked top to bottom. The first one that is true runs its block; all others are skipped. The else catches anything below 50.',
'Enter your score: 82
Grade: B — Good job!', 1),
(4, 'java', 'Grade Calculator using if/else if/else in Java',
'import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 75) {
            System.out.println("Grade: B");
        } else if (score >= 50) {
            System.out.println("Grade: C");
        } else {
            System.out.println("Grade: F");
        }
    }
}',
'Same logic in Java. Note the parentheses around each condition and curly braces around each block.',
'82
Grade: B', 2),
(4, 'c', 'Grade Calculator using if/else if/else in C',
'#include <stdio.h>
int main() {
    int score;
    scanf("%d", &score);
    if (score >= 90)
        printf("Grade: A\n");
    else if (score >= 75)
        printf("Grade: B\n");
    else if (score >= 50)
        printf("Grade: C\n");
    else
        printf("Grade: F\n");
    return 0;
}',
'In C, single-statement blocks do not need braces, but adding them is good practice. The logic flows identically to Python and Java.',
'82
Grade: B', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(4, '[{"label":"score = 82","caption":"We have a score of 82. We will check conditions one by one from top to bottom.","boxes":[{"id":"s","label":"score","value":"82","highlight":false}]},{"label":"score >= 90?","caption":"Is 82 >= 90? No. Skip this block, move to the next condition.","boxes":[{"id":"s","label":"score","value":"82","highlight":true},{"id":"c","label":"condition","value":"82 >= 90 = FALSE","highlight":true}]},{"label":"score >= 75?","caption":"Is 82 >= 75? YES. Enter this block and print Grade B.","boxes":[{"id":"s","label":"score","value":"82","highlight":true},{"id":"c","label":"condition","value":"82 >= 75 = TRUE","highlight":true}]},{"label":"Output","caption":"Grade: B is printed. All remaining else-if and else blocks are skipped.","boxes":[{"id":"out","label":"output","value":"Grade: B","highlight":true}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 5: Loops
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(5, 'ANALOGY', 'What is a Loop?',
'Imagine writing "I will study hard" 100 times on a blackboard. Instead of writing it 100 times in your code, you use a **loop** — it repeats an action automatically for as many times as you want.',
1),
(5, 'CONCEPT', 'The for Loop',
'A `for` loop is used when you know **exactly how many times** to repeat:

- **Python**: `for i in range(5):` runs 5 times, i goes 0, 1, 2, 3, 4
- **Java and C**: `for (int i = 0; i < 5; i++)` has three parts:
  1. **Initialization**: `int i = 0` — starting value
  2. **Condition**: `i < 5` — keep looping while this is true
  3. **Update**: `i++` — increment i after each iteration',
2),
(5, 'CONCEPT', 'The while Loop',
'A `while` loop repeats **as long as a condition is true** — useful when you do not know the count in advance:

- Check the condition before each iteration
- If true, run the body; if false, exit the loop
- **Risk**: if the condition never becomes false, the loop runs forever (infinite loop)
- Always make sure something inside the loop eventually makes the condition false',
3),
(5, 'CONCEPT', 'break and continue',
'- **`break`** — immediately exits the loop entirely
- **`continue`** — skips the rest of the current iteration and jumps to the next one

Example: print numbers 1 to 10 but skip 5 using continue:
```
for i in range(1, 11):
    if i == 5:
        continue
    print(i)
```',
4),
(5, 'MISTAKES', 'Common Mistakes',
'- **Off-by-one**: `for i in range(10)` gives 0 to 9, not 1 to 10. Use `range(1, 11)` for 1 to 10.
- **Infinite loop**: forgetting to increment in a while loop: `while i < 10` with no `i += 1` inside.
- **Modifying the loop variable** inside a for loop often causes confusing behavior — avoid it.',
5),
(5, 'SUMMARY', 'Key Takeaways',
'- `for` loop: use when you know the count in advance
- `while` loop: use when repeating until a condition changes
- `break` exits the loop immediately
- `continue` skips to the next iteration
- Always ensure a while loop has an exit condition to avoid infinite loops',
6);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(5, 'python', 'for and while Loops in Python',
'# for loop: print 1 to 5
for i in range(1, 6):
    print("Count:", i)

# while loop: countdown
n = 3
while n > 0:
    print("Countdown:", n)
    n -= 1
print("Go!")',
'range(1, 6) generates numbers 1, 2, 3, 4, 5. The while loop runs while n > 0, decrementing n each time until it reaches 0 and the condition becomes false.',
'Count: 1
Count: 2
Count: 3
Count: 4
Count: 5
Countdown: 3
Countdown: 2
Countdown: 1
Go!', 1),
(5, 'java', 'for and while Loops in Java',
'public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
        int n = 3;
        while (n > 0) {
            System.out.println("Countdown: " + n);
            n--;
        }
        System.out.println("Go!");
    }
}',
'The for loop runs while i <= 5, incrementing i (i++) each time. The while loop decrements n (n--) until it reaches 0.',
'Count: 1
Count: 2
Count: 3
Count: 4
Count: 5
Countdown: 3
Countdown: 2
Countdown: 1
Go!', 2),
(5, 'c', 'for and while Loops in C',
'#include <stdio.h>
int main() {
    for (int i = 1; i <= 5; i++) {
        printf("Count: %d\n", i);
    }
    int n = 3;
    while (n > 0) {
        printf("Countdown: %d\n", n);
        n--;
    }
    printf("Go!\n");
    return 0;
}',
'Same logic in C. printf with %d prints integers. n-- decrements n by 1 after each while iteration.',
'Count: 1
Count: 2
Count: 3
Count: 4
Count: 5
Countdown: 3
Countdown: 2
Countdown: 1
Go!', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(5, '[{"label":"i = 1","caption":"Loop starts. i is initialized to 1. Condition: is 1 <= 5? Yes, run body.","boxes":[{"id":"i","label":"i","value":"1","highlight":true},{"id":"c","label":"condition","value":"1 <= 5 = TRUE","highlight":false}]},{"label":"print 1","caption":"Print Count: 1. Then i++ so i becomes 2.","boxes":[{"id":"i","label":"i","value":"1 -> 2","highlight":true},{"id":"out","label":"output","value":"Count: 1","highlight":true}]},{"label":"i = 3","caption":"i is now 3. Condition 3 <= 5 is still true, keep looping.","boxes":[{"id":"i","label":"i","value":"3","highlight":true},{"id":"c","label":"condition","value":"3 <= 5 = TRUE","highlight":false}]},{"label":"i = 6","caption":"After printing 5, i becomes 6. Condition 6 <= 5 is FALSE. Loop exits.","boxes":[{"id":"i","label":"i","value":"6","highlight":true},{"id":"c","label":"condition","value":"6 <= 5 = FALSE","highlight":true}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 6: Functions
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(6, 'ANALOGY', 'What is a Function?',
'A function is like a **recipe**. You write it once and use it whenever you need it, without rewriting all the steps. You give it ingredients (**parameters**) and it gives back a result (**return value**).

For example, a "make coffee" function takes water and coffee beans and returns a cup of coffee.',
1),
(6, 'CONCEPT', 'Defining and Calling a Function',
'A function has:

- A **name** — how you refer to it
- **Parameters** — inputs it accepts (inside parentheses), optional
- A **body** — the code it runs
- A **return value** — the output it gives back, optional

You **define** a function once, then **call** it as many times as you need.',
2),
(6, 'CONCEPT', 'Syntax in Each Language',
'**Python** — use `def`, indented body:
```
def add(a, b):
    return a + b
result = add(3, 5)
```

**Java** — declare the return type before the name:
```
static int add(int a, int b) {
    return a + b;
}
int result = add(3, 5);
```

**C** — same as Java, define before calling:
```
int add(int a, int b) {
    return a + b;
}
int result = add(3, 5);
```',
3),
(6, 'CONCEPT', 'Parameters vs Arguments, Return vs Print',
'- **Parameters** are the placeholders in the function definition: `def greet(name):`
- **Arguments** are the actual values you pass when calling: `greet("Alice")`
- **Return** sends a value back to the caller — the caller can store or use it
- **Print** just displays something but does NOT send a value back

A function that returns a value is useful for computation; one that only prints is useful for display.',
4),
(6, 'MISTAKES', 'Common Mistakes',
'- Calling a function **before** defining it in C causes a compile error — define functions above `main` or use function prototypes.
- Forgetting `return` — the function returns `None` in Python or undefined in C.
- In Java, forgetting `static` on a method called from `main` causes a compilation error.',
5),
(6, 'SUMMARY', 'Key Takeaways',
'- A function groups reusable code under a name
- Parameters are inputs; return values are outputs
- Use `def` in Python, and return type + name in Java/C to define
- Call a function by writing its name with arguments: `add(3, 5)`
- Functions make code shorter, more readable, and easier to test',
6);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(6, 'python', 'Defining and Calling Functions in Python',
'def greet(name):
    return "Hello, " + name + "!"

def add(a, b):
    return a + b

def is_even(n):
    return n % 2 == 0

print(greet("Alice"))
print("3 + 7 =", add(3, 7))
print("Is 8 even?", is_even(8))
print("Is 5 even?", is_even(5))',
'Three functions: greet returns a string, add returns a sum, is_even returns a Boolean. Each is called and the returned value is passed directly to print.',
'Hello, Alice!
3 + 7 = 10
Is 8 even? True
Is 5 even? False', 1),
(6, 'java', 'Defining and Calling Functions in Java',
'public class Main {
    static String greet(String name) {
        return "Hello, " + name + "!";
    }
    static int add(int a, int b) {
        return a + b;
    }
    static boolean isEven(int n) {
        return n % 2 == 0;
    }
    public static void main(String[] args) {
        System.out.println(greet("Alice"));
        System.out.println("3 + 7 = " + add(3, 7));
        System.out.println("Is 8 even? " + isEven(8));
    }
}',
'In Java, methods inside the same class need the static keyword when called from main. The return type (String, int, boolean) must be declared.',
'Hello, Alice!
3 + 7 = 10
Is 8 even? true', 2),
(6, 'c', 'Defining and Calling Functions in C',
'#include <stdio.h>
int add(int a, int b) { return a + b; }
int isEven(int n) { return n % 2 == 0; }

int main() {
    printf("3 + 7 = %d\n", add(3, 7));
    printf("Is 8 even? %d\n", isEven(8));
    printf("Is 5 even? %d\n", isEven(5));
    return 0;
}',
'Functions are defined before main in C. isEven returns 1 (true) or 0 (false) as integers since C has no boolean type by default.',
'3 + 7 = 10
Is 8 even? 1
Is 5 even? 0', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(6, '[{"label":"Define","caption":"We define function add(a, b). No code runs yet — it is just stored in memory.","boxes":[{"id":"fn","label":"add(a,b)","value":"defined","highlight":false}]},{"label":"Call add(3,5)","caption":"We call add(3, 5). Values 3 and 5 are passed to parameters a and b.","boxes":[{"id":"a","label":"a","value":"3","highlight":true},{"id":"b","label":"b","value":"5","highlight":true}]},{"label":"Execute body","caption":"Inside the function: a + b = 3 + 5 = 8. This becomes the return value.","boxes":[{"id":"a","label":"a","value":"3","highlight":false},{"id":"b","label":"b","value":"5","highlight":false},{"id":"r","label":"return","value":"8","highlight":true}]},{"label":"Back to caller","caption":"The return value 8 arrives back at the call site and is stored in result.","boxes":[{"id":"result","label":"result","value":"8","highlight":true}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 7: Basic Patterns
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(7, 'ANALOGY', 'What are Patterns?',
'Printing patterns is like drawing on graph paper. You go **row by row** (outer loop) and in each row you draw **column by column** (inner loop). Nested loops are the key — one loop inside another.',
1),
(7, 'CONCEPT', 'Nested Loops',
'A **nested loop** is a loop inside another loop. For every one iteration of the **outer loop**, the **inner loop** runs completely from start to finish.

Example: if the outer loop runs 3 times and the inner loop runs 4 times, the inner body runs 3 times 4 = **12 times** in total.',
2),
(7, 'CONCEPT', 'Common Pattern Types',
'1. **Square of stars** — same number of stars per row
2. **Right triangle** — row i has i stars
3. **Inverted triangle** — row i has n minus i plus 1 stars
4. **Number pattern** — print the row or column number
5. **Pyramid** — combine spaces and stars using a formula

The trick is figuring out **how many spaces** and **how many characters** to print on each row.',
3),
(7, 'CONCEPT', 'Pattern Formula',
'For a right-triangle of n rows, on row i (1-indexed):
- Number of stars = `i`

For a pyramid of n rows, on row i:
- Number of spaces = `n - i`
- Number of stars = `2 * i - 1`

Once you understand the row-column relationship, any pattern is just filling in the formula.',
4),
(7, 'MISTAKES', 'Common Mistakes',
'- Using `print()` with default newline inside the inner loop — prints each star on a separate line. Use `print("*", end="")` in Python or `printf("*")` in C to stay on the same line.
- Off-by-one in the loop range breaks the shape.
- Forgetting to print a newline after finishing each row.',
5),
(7, 'SUMMARY', 'Key Takeaways',
'- Use nested loops: outer loop for rows, inner loop for columns
- Inner loop body runs outer_count times inner_count times in total
- Use `end=""` in Python or `printf` in C to print without newline
- Print a newline after each complete row
- Every pattern has a formula — find the relationship between the row number and what to print',
6);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(7, 'python', 'Right Triangle and Pyramid Patterns in Python',
'n = 5
print("Right Triangle:")
for i in range(1, n + 1):
    print("*" * i)

print()
print("Pyramid:")
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2 * i - 1))',
'For the triangle, each row i prints i stars using string multiplication. For the pyramid, we print (n-i) spaces then (2*i-1) stars on the same line.',
'Right Triangle:
*
**
***
****
*****

Pyramid:
    *
   ***
  *****
 *******
*********', 1),
(7, 'java', 'Right Triangle and Pyramid Patterns in Java',
'public class Main {
    public static void main(String[] args) {
        int n = 5;
        System.out.println("Right Triangle:");
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }
        System.out.println();
        System.out.println("Pyramid:");
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < n - i; j++) System.out.print(" ");
            for (int j = 0; j < 2 * i - 1; j++) System.out.print("*");
            System.out.println();
        }
    }
}',
'Java needs explicit nested for loops for columns. System.out.print (no ln) stays on the same line; println() ends the row with a newline.',
'Right Triangle:
*
**
***
****
*****

Pyramid:
    *
   ***
  *****
 *******
*********', 2),
(7, 'c', 'Right Triangle and Pyramid Patterns in C',
'#include <stdio.h>
int main() {
    int n = 5, i, j;
    printf("Right Triangle:\n");
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= i; j++) printf("*");
        printf("\n");
    }
    printf("\nPyramid:\n");
    for (i = 1; i <= n; i++) {
        for (j = 0; j < n - i; j++) printf(" ");
        for (j = 0; j < 2 * i - 1; j++) printf("*");
        printf("\n");
    }
    return 0;
}',
'Same pattern logic in C using nested for loops. printf without newline stays on the same line; printf("\\n") ends each row.',
'Right Triangle:
*
**
***
****
*****

Pyramid:
    *
   ***
  *****
 *******
*********', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(7, '[{"label":"Row 1","caption":"Outer loop i=1. Inner loop runs 1 time, print 1 star. Then newline.","boxes":[{"id":"i","label":"row (i)","value":"1","highlight":true},{"id":"out","label":"output","value":"*","highlight":true}]},{"label":"Row 2","caption":"Outer loop i=2. Inner loop runs 2 times, print 2 stars. Then newline.","boxes":[{"id":"i","label":"row (i)","value":"2","highlight":true},{"id":"out","label":"output","value":"**","highlight":true}]},{"label":"Row 3","caption":"Outer loop i=3. Inner loop runs 3 times, print 3 stars.","boxes":[{"id":"i","label":"row (i)","value":"3","highlight":true},{"id":"out","label":"output","value":"***","highlight":true}]},{"label":"Complete","caption":"After 5 rows the outer loop ends. We have a right triangle of 5 rows.","boxes":[{"id":"tri","label":"triangle","value":"* / ** / *** / **** / *****","highlight":false}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 9: Strings
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(9, 'ANALOGY', 'What is a String?',
'A **string** is a sequence of characters stored one after another — like beads on a necklace. Each character has a position called an **index**, starting from **0**. So "Hello" has H at index 0, e at index 1, l at index 2, and so on.',
1),
(9, 'CONCEPT', 'String Indexing and Slicing',
'- **Indexing**: access a single character — `s[0]` gives the first character
- **Negative index**: `s[-1]` gives the **last** character
- **Slicing (Python)**: `s[1:4]` gives characters from index 1 up to (not including) index 4

Common string properties:
- **Length**: `len(s)` in Python, `s.length()` in Java, `strlen(s)` in C',
2),
(9, 'CONCEPT', 'Common String Operations',
'- **Concatenation**: joining strings — `"Hello" + " World"` gives `"Hello World"`
- **Contains / search**: check if a substring exists — `"lo" in s` (Python), `s.contains("lo")` (Java)
- **Upper and lower case**: `s.upper()`, `s.lower()`
- **Replace**: `s.replace("old", "new")`
- **Split**: `s.split(" ")` breaks into a list of words
- **Strip / trim**: remove leading and trailing spaces — `s.strip()` (Python), `s.trim()` (Java)
- **Starts with / ends with**: `s.startswith("He")`, `s.endswith("ld")`',
3),
(9, 'CONCEPT', 'Strings are Immutable in Java and Python',
'In Java and Python, strings **cannot be changed** after creation. When you "modify" a string you are actually creating a new one:

```python
s = "Hello"
s = s + " World"
```
This creates a brand new string "Hello World" — the original "Hello" is unchanged in memory.

In C, strings are character arrays and can be modified in place.',
4),
(9, 'MISTAKES', 'Common Mistakes',
'- **Index out of bounds**: accessing `s[len(s)]` crashes. Valid indices are 0 to `len(s) - 1`.
- **Comparing strings with `==` in Java**: use `s.equals("text")`, not `s == "text"` (which compares references, not content).
- **Forgetting null terminator in C**: C strings end with `\0`; always allocate one extra byte for it.',
5),
(9, 'SUMMARY', 'Key Takeaways',
'- Strings are sequences of characters; each has an index starting from 0
- Common operations: concat, length, upper/lower, replace, split, strip
- Python and Java strings are immutable — modification creates a new string
- In Java, compare strings with `.equals()` not `==`
- In C, strings are char arrays ending with a null character',
6);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(9, 'python', 'String Operations in Python',
's = "Hello, World!"
print("Length:", len(s))
print("First char:", s[0])
print("Last char:", s[-1])
print("Slice [7:12]:", s[7:12])
print("Upper:", s.upper())
print("Replace:", s.replace("World", "Python"))
words = "apple banana cherry"
print("Split:", words.split(" "))',
'We use len() for length, [] for indexing, [start:end] for slicing, and built-in methods for case, replace, and split.',
'Length: 13
First char: H
Last char: !
Slice [7:12]: World
Upper: HELLO, WORLD!
Replace: Hello, Python!
Split: [''apple'', ''banana'', ''cherry'']', 1),
(9, 'java', 'String Operations in Java',
'public class Main {
    public static void main(String[] args) {
        String s = "Hello, World!";
        System.out.println("Length: " + s.length());
        System.out.println("First char: " + s.charAt(0));
        System.out.println("Substring: " + s.substring(7, 12));
        System.out.println("Upper: " + s.toUpperCase());
        System.out.println("Contains World: " + s.contains("World"));
        System.out.println("Replace: " + s.replace("World", "Java"));
    }
}',
'Java string methods: length(), charAt(index), substring(start, end), toUpperCase(), contains(), and replace().',
'Length: 13
First char: H
Substring: World
Upper: HELLO, WORLD!
Contains World: true
Replace: Hello, Java!', 2),
(9, 'c', 'String Operations in C',
'#include <stdio.h>
#include <string.h>
int main() {
    char s[] = "Hello, World!";
    printf("Length: %lu\n", strlen(s));
    printf("First char: %c\n", s[0]);
    printf("Last char: %c\n", s[strlen(s)-1]);
    return 0;
}',
'In C, strings are char arrays. strlen() gives the length. Access characters by index. The standard library string.h provides functions like strlen, strcpy, strcat.',
'Length: 13
First char: H
Last char: !', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(9, '[{"label":"Stored","caption":"String Hello is stored as 5 character boxes at indices 0 through 4.","boxes":[{"id":"0","label":"[0]","value":"H","highlight":false},{"id":"1","label":"[1]","value":"e","highlight":false},{"id":"2","label":"[2]","value":"l","highlight":false},{"id":"3","label":"[3]","value":"l","highlight":false},{"id":"4","label":"[4]","value":"o","highlight":false}]},{"label":"s[0]","caption":"Accessing s[0] returns the character at index 0 which is H.","boxes":[{"id":"0","label":"[0]","value":"H","highlight":true},{"id":"1","label":"[1]","value":"e","highlight":false},{"id":"2","label":"[2]","value":"l","highlight":false},{"id":"3","label":"[3]","value":"l","highlight":false},{"id":"4","label":"[4]","value":"o","highlight":false}]},{"label":"s[-1]","caption":"Negative index -1 always refers to the LAST character, which is o at index 4.","boxes":[{"id":"0","label":"[0]","value":"H","highlight":false},{"id":"1","label":"[1]","value":"e","highlight":false},{"id":"2","label":"[2]","value":"l","highlight":false},{"id":"3","label":"[3]","value":"l","highlight":false},{"id":"4","label":"[-1]","value":"o","highlight":true}]},{"label":"len()","caption":"len(s) = 5. Counts all 5 boxes. Valid indices are 0 to 4.","boxes":[{"id":"0","label":"[0]","value":"H","highlight":false},{"id":"1","label":"[1]","value":"e","highlight":false},{"id":"2","label":"[2]","value":"l","highlight":false},{"id":"3","label":"[3]","value":"l","highlight":false},{"id":"4","label":"[4]","value":"o","highlight":false}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 10: Searching
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(10, 'ANALOGY', 'What is Searching?',
'Searching means finding a specific item in a collection. Imagine looking for a word in a book. You could read every page from the first (**linear search**), or if the book has an index you jump directly to the right page (**binary search**). Binary search is much faster — but only works if the data is **sorted**.',
1),
(10, 'CONCEPT', 'Linear Search',
'**Linear Search** checks every element one by one from start to end until it finds the target.

- Works on **unsorted or sorted** arrays
- Time complexity: **O(n)** — in the worst case you check all n elements
- Simple to implement — just a for loop with an if inside

It is slow for large arrays but perfectly fine for small ones.',
2),
(10, 'CONCEPT', 'Binary Search',
'**Binary Search** works only on a **sorted array**. It repeatedly halves the search range:

1. Start with `low = 0`, `high = n - 1`
2. Find `mid = (low + high) / 2`
3. If `arr[mid] == target`, found!
4. If `arr[mid] < target`, target is in the **right half**, set `low = mid + 1`
5. If `arr[mid] > target`, target is in the **left half**, set `high = mid - 1`
6. Repeat until found or `low > high` (not found, return -1)

Time complexity: **O(log n)** — for 1 million elements, only about 20 steps!',
3),
(10, 'MISTAKES', 'Common Mistakes',
'- Using binary search on an **unsorted array** gives wrong results — always sort first.
- Integer overflow in the mid calculation: use `mid = low + (high - low) / 2` instead of `(low + high) / 2` in Java/C to avoid overflow with large indices.
- Forgetting to return -1 when the loop ends without finding the target.',
4),
(10, 'SUMMARY', 'Key Takeaways',
'- **Linear search**: O(n), works on any array, checks one by one
- **Binary search**: O(log n), requires sorted array, halves range each step
- Binary search is exponentially faster for large sorted data
- Both return the index of the found element or -1 if not found',
5);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(10, 'python', 'Linear Search and Binary Search in Python',
'def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

arr = [2, 5, 8, 12, 16, 23, 38, 45]
print("Linear search for 23:", linear_search(arr, 23))
print("Binary search for 23:", binary_search(arr, 23))
print("Search for 99:", binary_search(arr, 99))',
'linear_search checks every element one by one. binary_search halves the range each step using integer division. Both return the index or -1 if not found.',
'Linear search for 23: 5
Binary search for 23: 5
Search for 99: -1', 1),
(10, 'java', 'Linear Search and Binary Search in Java',
'public class Main {
    static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++)
            if (arr[i] == target) return i;
        return -1;
    }
    static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 45};
        System.out.println("Linear search for 23: " + linearSearch(arr, 23));
        System.out.println("Binary search for 23: " + binarySearch(arr, 23));
    }
}',
'Note mid = low + (high - low) / 2 to avoid integer overflow. Returns the index of the found element or -1.',
'Linear search for 23: 5
Binary search for 23: 5', 2),
(10, 'c', 'Linear Search and Binary Search in C',
'#include <stdio.h>
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (arr[i] == target) return i;
    return -1;
}
int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 45};
    int n = 8;
    printf("Linear: %d\n", linearSearch(arr, n, 23));
    printf("Binary: %d\n", binarySearch(arr, n, 23));
    return 0;
}',
'In C, arrays are passed with their size. Same algorithm as Python and Java.',
'Linear: 5
Binary: 5', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(10, '[{"label":"Start","caption":"Array: [2,5,8,12,16,23,38,45]. Searching for 23. low=0, high=7.","boxes":[{"id":"0","label":"[0]","value":"2","highlight":false},{"id":"1","label":"[1]","value":"5","highlight":false},{"id":"2","label":"[2]","value":"8","highlight":false},{"id":"3","label":"[3]","value":"12","highlight":false},{"id":"4","label":"[4]","value":"16","highlight":false},{"id":"5","label":"[5]","value":"23","highlight":false},{"id":"6","label":"[6]","value":"38","highlight":false},{"id":"7","label":"[7]","value":"45","highlight":false}]},{"label":"Step 1","caption":"mid=(0+7)/2=3. arr[3]=12. 12 < 23, so target is in right half. Set low=4.","boxes":[{"id":"3","label":"[3] mid","value":"12","highlight":true},{"id":"5","label":"[5]","value":"23","highlight":false}]},{"label":"Step 2","caption":"mid=(4+7)/2=5. arr[5]=23. 23==23, FOUND at index 5!","boxes":[{"id":"5","label":"[5] mid","value":"23","highlight":true}]},{"label":"Found!","caption":"Binary search found 23 at index 5 in only 2 steps. Linear would need 6 steps.","boxes":[{"id":"5","label":"index 5","value":"23 found!","highlight":true}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 11: Sorting
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(11, 'ANALOGY', 'What is Sorting?',
'Sorting means arranging elements in order — like organizing books on a shelf from shortest to tallest. There are many ways to sort. Two simple ones are **Bubble Sort** (comparing neighbors and swapping) and **Selection Sort** (finding the smallest and placing it first).',
1),
(11, 'CONCEPT', 'Bubble Sort',
'**Bubble Sort** repeatedly compares adjacent elements and swaps them if they are out of order. After each full pass, the largest unsorted element bubbles to the right end.

- **Passes**: n minus 1 passes for n elements
- Each pass places the current maximum at its final position
- **Time complexity**: O(n squared) — slow for large data, but simple
- **Space complexity**: O(1) — sorts in place with no extra array needed',
2),
(11, 'CONCEPT', 'Selection Sort',
'**Selection Sort** finds the minimum element from the unsorted portion and puts it at the beginning.

- On pass i, find the minimum of `arr[i]` to `arr[n-1]` and swap it with `arr[i]`
- After k passes, the first k elements are in their correct sorted position
- **Time complexity**: O(n squared) always, regardless of input
- **Space complexity**: O(1) in place

**Optimization tip for Bubble Sort**: if no swaps happen in a complete pass, the array is already sorted — you can break early.',
3),
(11, 'MISTAKES', 'Common Mistakes',
'- Forgetting that a swap requires a **temp variable** in Java and C: `temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;`
- Off-by-one in the inner loop: bubble sort inner loop should go up to `n - i - 1` because the last i elements are already sorted.
- Confusing ascending and descending: use `arr[j] > arr[j+1]` to sort ascending; use `<` for descending.',
4),
(11, 'SUMMARY', 'Key Takeaways',
'- Bubble Sort: compare adjacent pairs, swap if out of order, repeat n-1 passes
- Selection Sort: find minimum of unsorted portion, place at front, repeat
- Both are O(n squared) — fine for small arrays, too slow for large ones
- Real code uses built-in sorts: `sorted()` or `.sort()` in Python, `Arrays.sort()` in Java
- Understanding these basics is essential for coding interviews',
5);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(11, 'python', 'Bubble Sort and Selection Sort in Python',
'def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

arr1 = [64, 25, 12, 22, 11]
arr2 = [64, 25, 12, 22, 11]
print("Bubble Sort:", bubble_sort(arr1))
print("Selection Sort:", selection_sort(arr2))',
'Bubble sort uses Python tuple swap (no temp variable needed). Selection sort tracks the index of the minimum and swaps it into position.',
'Bubble Sort: [11, 12, 22, 25, 64]
Selection Sort: [11, 12, 22, 25, 64]', 1),
(11, 'java', 'Bubble Sort in Java',
'import java.util.Arrays;
public class Main {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }
    public static void main(String[] args) {
        int[] arr = {64, 25, 12, 22, 11};
        bubbleSort(arr);
        System.out.println("Sorted: " + Arrays.toString(arr));
    }
}',
'In Java we need a temp variable for swapping. Arrays.toString() prints the array in a readable format.',
'Sorted: [11, 12, 22, 25, 64]', 2),
(11, 'c', 'Bubble Sort in C',
'#include <stdio.h>
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
}
int main() {
    int arr[] = {64, 25, 12, 22, 11};
    int n = 5;
    bubbleSort(arr, n);
    printf("Sorted: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    return 0;
}',
'C bubble sort uses temp for swapping. Arrays are passed by pointer so changes inside the function affect the original array.',
'Sorted: 11 12 22 25 64', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(11, '[{"label":"Start","caption":"Array: [64, 25, 12, 22, 11]. We will sort ascending with Bubble Sort.","boxes":[{"id":"0","label":"[0]","value":"64","highlight":false},{"id":"1","label":"[1]","value":"25","highlight":false},{"id":"2","label":"[2]","value":"12","highlight":false},{"id":"3","label":"[3]","value":"22","highlight":false},{"id":"4","label":"[4]","value":"11","highlight":false}]},{"label":"Pass 1, j=0","caption":"Compare arr[0]=64 and arr[1]=25. 64 > 25, SWAP them.","boxes":[{"id":"0","label":"[0]","value":"64","highlight":true},{"id":"1","label":"[1]","value":"25","highlight":true},{"id":"2","label":"[2]","value":"12","highlight":false},{"id":"3","label":"[3]","value":"22","highlight":false},{"id":"4","label":"[4]","value":"11","highlight":false}]},{"label":"After j=0","caption":"After swap: [25, 64, 12, 22, 11]. 64 bubbles one step to the right.","boxes":[{"id":"0","label":"[0]","value":"25","highlight":false},{"id":"1","label":"[1]","value":"64","highlight":true},{"id":"2","label":"[2]","value":"12","highlight":false},{"id":"3","label":"[3]","value":"22","highlight":false},{"id":"4","label":"[4]","value":"11","highlight":false}]},{"label":"Pass 1 done","caption":"After full pass 1: [25, 12, 22, 11, 64]. The largest (64) is at the end in final position.","boxes":[{"id":"0","label":"[0]","value":"25","highlight":false},{"id":"1","label":"[1]","value":"12","highlight":false},{"id":"2","label":"[2]","value":"22","highlight":false},{"id":"3","label":"[3]","value":"11","highlight":false},{"id":"4","label":"[4] done","value":"64","highlight":true}]},{"label":"Sorted","caption":"After 4 passes: [11, 12, 22, 25, 64]. All elements in ascending order!","boxes":[{"id":"0","label":"[0]","value":"11","highlight":true},{"id":"1","label":"[1]","value":"12","highlight":true},{"id":"2","label":"[2]","value":"22","highlight":true},{"id":"3","label":"[3]","value":"25","highlight":true},{"id":"4","label":"[4]","value":"64","highlight":true}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 12: Time Complexity
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(12, 'ANALOGY', 'What is Time Complexity?',
'Imagine you have a list of 1000 names and need to find one. If you check one by one it takes up to 1000 checks. If the list is sorted and you use binary search, it takes only about 10 checks. **Time complexity** measures how the number of operations **grows with the input size** — not actual clock seconds.',
1),
(12, 'CONCEPT', 'Big-O Notation',
'Big-O describes the **worst-case growth rate** of an algorithm as input size n gets large. Common complexities from fastest to slowest:

- **O(1)** — Constant: same time regardless of input size (e.g., access `arr[5]`)
- **O(log n)** — Logarithmic: halves input each step (e.g., binary search)
- **O(n)** — Linear: one operation per element (e.g., linear search, single loop)
- **O(n log n)** — efficient sorting algorithms (e.g., merge sort, quick sort)
- **O(n squared)** — Quadratic: nested loops (e.g., bubble sort, selection sort)
- **O(2 to the n)** — Exponential: very slow for large n (e.g., brute-force subsets)',
2),
(12, 'CONCEPT', 'How to Calculate Big-O',
'Simple rules for finding complexity:

1. **Single loop 0 to n** gives O(n)
2. **Two nested loops 0 to n** gives O(n squared)
3. **Halving each step** (divide by 2 repeatedly) gives O(log n)
4. **Constant operations** (no loops, no recursion) gives O(1)
5. **Drop constants and lower terms**: O(2n + 5) becomes O(n), and O(n squared + n) becomes O(n squared)

We only care about the **dominant term** as n gets very large.',
3),
(12, 'CONCEPT', 'Space Complexity',
'**Space complexity** measures extra memory used by an algorithm.

- **O(1)** — in-place: uses only a few extra variables regardless of n
- **O(n)** — linear space: stores a copy of the input or a result array of size n
- **O(n squared)** — quadratic space: a 2D grid of size n by n

When optimizing, consider both time AND space — sometimes you can trade one for the other.',
4),
(12, 'MISTAKES', 'Common Mistakes',
'- Saying O(2n) is faster than O(n) — it is still O(n) because constants are dropped.
- Confusing average-case with worst-case. Big-O usually refers to worst-case.
- Thinking O(1) means exactly one step — it just means constant, could be 100 constant steps that do not grow with n.',
5),
(12, 'SUMMARY', 'Key Takeaways',
'- Big-O measures how an algorithm scales with input size
- O(1) is fastest, O(2 to the n) is slowest for large inputs
- Single loop = O(n), nested loop = O(n squared), halving = O(log n)
- Drop constants and lower-order terms
- Always consider both time and space complexity when designing algorithms',
6);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(12, 'python', 'Comparing O(1), O(n), and O(n squared) in Python',
'def get_first(arr):       # O(1)
    return arr[0]

def linear_sum(arr):       # O(n)
    total = 0
    for x in arr:
        total += x
    return total

def count_pairs(arr):      # O(n squared)
    count = 0
    for i in arr:
        for j in arr:
            count += 1
    return count

arr = list(range(1, 6))
print("O(1) first element:", get_first(arr))
print("O(n) sum:", linear_sum(arr))
print("O(n^2) pair count:", count_pairs(arr))',
'O(1) does one operation. O(n) loops through all n elements once. O(n squared) has nested loops: 5 elements means 25 total inner iterations.',
'O(1) first element: 1
O(n) sum: 15
O(n^2) pair count: 25', 1),
(12, 'java', 'Comparing Complexities in Java',
'public class Main {
    static int getFirst(int[] arr) { return arr[0]; }
    static long linearSum(int[] arr) {
        long s = 0;
        for (int x : arr) s += x;
        return s;
    }
    static int countPairs(int[] arr) {
        int count = 0;
        for (int i : arr)
            for (int j : arr)
                count++;
        return count;
    }
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        System.out.println("O(1): " + getFirst(arr));
        System.out.println("O(n): " + linearSum(arr));
        System.out.println("O(n^2): " + countPairs(arr));
    }
}',
'Same three algorithms in Java. The enhanced for-each loop is syntactic sugar for iterating all elements of an array.',
'O(1): 1
O(n): 15
O(n^2): 25', 2),
(12, 'c', 'Comparing Complexities in C',
'#include <stdio.h>
int getFirst(int arr[]) { return arr[0]; }
long linearSum(int arr[], int n) {
    long s = 0;
    for (int i = 0; i < n; i++) s += arr[i];
    return s;
}
int countPairs(int arr[], int n) {
    int count = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            count++;
    return count;
}
int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int n = 5;
    printf("O(1): %d\n", getFirst(arr));
    printf("O(n): %ld\n", linearSum(arr, n));
    printf("O(n^2): %d\n", countPairs(arr, n));
    return 0;
}',
'In C we pass the array size explicitly. %ld is used for long integers to avoid overflow with large sums.',
'O(1): 1
O(n): 15
O(n^2): 25', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(12, '[{"label":"O(1)","caption":"Accessing arr[0] is one operation no matter how large the array is. Constant time.","boxes":[{"id":"op","label":"operations","value":"1","highlight":true},{"id":"n","label":"input n","value":"any size","highlight":false}]},{"label":"O(n)","caption":"A single loop over n elements: 10 elements = 10 ops, 100 = 100 ops. Grows linearly.","boxes":[{"id":"op","label":"operations","value":"n","highlight":true},{"id":"n","label":"n=100","value":"100 ops","highlight":false}]},{"label":"O(log n)","caption":"Binary search halves the range: 1024 elements needs only 10 steps because 2 to the 10 = 1024.","boxes":[{"id":"op","label":"operations","value":"log2(n)","highlight":true},{"id":"n","label":"n=1024","value":"10 steps","highlight":false}]},{"label":"O(n^2)","caption":"Nested loop: n=10 gives 100 ops, n=100 gives 10000 ops. Grows very fast!","boxes":[{"id":"op","label":"operations","value":"n x n","highlight":true},{"id":"n","label":"n=100","value":"10000 ops","highlight":true}]}]');

-- ─────────────────────────────────────────────────────────────
-- TOPIC 13: Basic Recursion
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(13, 'ANALOGY', 'What is Recursion?',
'Imagine you are in a line of people and you want to know what position you are at. You ask the person in front "what position are you?", who asks the person in front of them, and so on. When the first person says "I am 1st", the answer travels back: "I am 2nd", "I am 3rd"... This is recursion: **a function calling itself** to solve a smaller version of the same problem.',
1),
(13, 'CONCEPT', 'Two Essential Parts of Recursion',
'Every recursive function MUST have:

1. **Base case** — the condition where the function STOPS calling itself and returns a direct answer. Without this, you get infinite recursion and a **Stack Overflow** error.

2. **Recursive case** — the part where the function calls itself with a **smaller or simpler** input, moving towards the base case.

Example: factorial(n) = n times factorial(n-1), and factorial(0) = 1 is the base case.',
2),
(13, 'CONCEPT', 'How the Call Stack Works',
'When a function calls itself, each call is added to the **call stack** (like stacking plates). The stack grows until the base case is hit, then each call returns and the stack shrinks.

For factorial(4):
1. factorial(4) calls factorial(3)
2. factorial(3) calls factorial(2)
3. factorial(2) calls factorial(1)
4. factorial(1) calls factorial(0) which returns 1 (base case)
5. Then answers travel back: 1 gives 1, 1 gives 2, 2 gives 6, 6 gives 24

This is why a missing base case causes a **Stack Overflow** error.',
3),
(13, 'CONCEPT', 'Common Recursive Problems',
'Classic recursion examples:

- **Factorial**: `fact(n) = n * fact(n-1)`, base case: `fact(0) = 1`
- **Fibonacci**: `fib(n) = fib(n-1) + fib(n-2)`, base cases: `fib(0)=0` and `fib(1)=1`
- **Sum of array**: call with smaller array each time
- **Reverse a string**: reverse the tail and append the first character
- **Binary search**: recursively search the left or right half',
4),
(13, 'MISTAKES', 'Common Mistakes',
'- **Missing base case** gives infinite recursion and a Stack Overflow error
- **Wrong base case**: returning the wrong value breaks all recursive results that depend on it
- **Not reducing the problem**: if the recursive call does not move towards the base case, it loops forever
- Naive Fibonacci is O(2 to the n) — very slow for large n. Use memoization or iteration for better performance.',
5),
(13, 'SUMMARY', 'Key Takeaways',
'- Recursion: a function calling itself with a smaller input
- ALWAYS need a base case to stop the recursion
- Each recursive call is added to the call stack; it unwinds as calls return
- Great for problems that naturally break into smaller identical sub-problems
- Watch out for missing base cases (Stack Overflow) and redundant calls (slow performance)',
6);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(13, 'python', 'Factorial and Fibonacci using Recursion in Python',
'def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("5! =", factorial(5))
print("fib(7) =", fibonacci(7))
print("Fibonacci sequence:", [fibonacci(i) for i in range(8)])',
'factorial has base case n==0 returns 1. fibonacci has two base cases: n=0 returns 0 and n=1 returns 1. Each call adds the results of two smaller calls.',
'5! = 120
fib(7) = 13
Fibonacci sequence: [0, 1, 1, 2, 3, 5, 8, 13]', 1),
(13, 'java', 'Factorial and Fibonacci using Recursion in Java',
'public class Main {
    static long factorial(int n) {
        if (n == 0) return 1;
        return n * factorial(n - 1);
    }
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5));
        System.out.println("fib(7) = " + fibonacci(7));
        System.out.print("Fibonacci: ");
        for (int i = 0; i < 8; i++)
            System.out.print(fibonacci(i) + " ");
        System.out.println();
    }
}',
'long return type handles larger factorials. fibonacci calls itself twice per call and the results are added together.',
'5! = 120
fib(7) = 13
Fibonacci: 0 1 1 2 3 5 8 13', 2),
(13, 'c', 'Factorial and Fibonacci using Recursion in C',
'#include <stdio.h>
long factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
int main() {
    printf("5! = %ld\n", factorial(5));
    printf("fib(7) = %d\n", fibonacci(7));
    printf("Fibonacci: ");
    for (int i = 0; i < 8; i++)
        printf("%d ", fibonacci(i));
    printf("\n");
    return 0;
}',
'Same recursive logic in C. %ld prints long integers. The for loop calls fibonacci 8 separate times to print the sequence.',
'5! = 120
fib(7) = 13
Fibonacci: 0 1 1 2 3 5 8 13', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(13, '[{"label":"factorial(4)","caption":"factorial(4) is called. Since 4 is not 0, it calls factorial(3) and waits.","boxes":[{"id":"f4","label":"factorial(4)","value":"waiting...","highlight":true}]},{"label":"Stack builds","caption":"Each call waits for the next. factorial(0) hits the base case and returns 1.","boxes":[{"id":"f4","label":"factorial(4)","value":"waiting","highlight":false},{"id":"f3","label":"factorial(3)","value":"waiting","highlight":false},{"id":"f2","label":"factorial(2)","value":"waiting","highlight":false},{"id":"f1","label":"factorial(1)","value":"waiting","highlight":false},{"id":"f0","label":"factorial(0)","value":"returns 1","highlight":true}]},{"label":"Unwinds","caption":"factorial(0) returns 1. factorial(1) = 1x1=1. factorial(2) = 2x1=2.","boxes":[{"id":"f2","label":"factorial(2)","value":"2x1 = 2","highlight":true},{"id":"f1","label":"factorial(1)","value":"1x1 = 1","highlight":false},{"id":"f0","label":"factorial(0)","value":"1","highlight":false}]},{"label":"Answer","caption":"factorial(3) = 3x2 = 6. factorial(4) = 4x6 = 24. Stack fully unwound!","boxes":[{"id":"f4","label":"factorial(4)","value":"4x6 = 24","highlight":true}]}]');
