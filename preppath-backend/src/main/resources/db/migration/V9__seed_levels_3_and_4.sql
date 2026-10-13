-- =============================================================
-- V9: Seed Level 3 (Intermediate DSA) and Level 4 (Advanced DSA)
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. SEED CODING TOPICS (Level 3: 14 to 19, Level 4: 20 to 26)
-- ─────────────────────────────────────────────────────────────
INSERT INTO coding_topics (id, level_number, name, sequence_order, summary) VALUES
-- Level 3: Intermediate DSA
(14, 3, 'Singly & Doubly Linked Lists', 1, 'Nodes chained together via memory pointers rather than contiguous slots.'),
(15, 3, 'Stacks (LIFO)', 2, 'Last-In First-Out data structure used in undo operations, brackets, and recursion.'),
(16, 3, 'Queues (FIFO)', 3, 'First-In First-Out structure used in scheduling, pipelines, and breadth-first search.'),
(17, 3, 'Hashing & Hash Maps', 4, 'Key-value mapping providing lightning-fast O(1) average time lookups and frequencies.'),
(18, 3, 'Binary Search on Answers', 5, 'Searching monotonic predicate spaces to find optimal thresholds and values.'),
(19, 3, 'Two Pointers & Sliding Window', 6, 'Efficient O(n) array traversal techniques for subarray and pair problems.'),

-- Level 4: Advanced DSA
(20, 4, 'Binary Trees & Traversals', 1, 'Hierarchical node trees explored via Inorder, Preorder, and Postorder traversals.'),
(21, 4, 'Binary Search Trees (BST)', 2, 'Ordered binary trees offering logarithmic lookup, insertion, and deletion.'),
(22, 4, 'Heaps & Priority Queues', 3, 'Complete binary tree structures for finding min or max elements in O(1) time.'),
(23, 4, 'Graphs & BFS / DFS', 4, 'Networks of vertices and edges traversed using Breadth-First and Depth-First search.'),
(24, 4, 'Backtracking', 5, 'Exploring all decision paths systematically and pruning dead ends (N-Queens, Subsets).'),
(25, 4, 'Greedy Algorithms', 6, 'Making locally optimal choices at each stage to reach a global optimum.'),
(26, 4, 'Dynamic Programming (DP)', 7, 'Breaking complex problems into overlapping subproblems with memoization & tabulation.');


-- =============================================================
-- 2. LEVEL 3 TOPIC SECTIONS, EXAMPLES & VISUALIZATIONS
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- TOPIC 14: Linked Lists
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(14, 'ANALOGY', 'Real-Life Analogy: The Treasure Hunt',
'Think of a **Linked List** like a treasure hunt. Each clue you find tells you where the clue is, and also gives you a note pointing to **the next location**.
Unlike an array (where all lockers are right next to each other in a single row), linked list nodes can be scattered anywhere in the computer''s memory, as long as each node holds a **pointer (reference)** to the next node.', 1),
(14, 'CONCEPT', 'Node Anatomy & Key Operations',
'A linked list is made up of **Nodes**:
- **Data**: The value stored inside (e.g., integer `10`).
- **Next**: A pointer or reference storing the memory address of the next node.
- **Head**: A pointer to the very first node.
- **Tail / Null**: The last node points to `null` (`None` in Python), indicating the end of the list.

### Singly vs Doubly Linked List
- **Singly Linked List**: Each node points only to the next node (`next`).
- **Doubly Linked List**: Each node points to both the `next` and the `prev` (previous) node, allowing traversal in both directions.', 2),
(14, 'MISTAKES', 'Common Pitfalls',
'- **Losing the Head pointer**: Never reassign `head = head.next` without keeping a traversal pointer (like `current = head`). Otherwise, all earlier elements are lost in memory forever!
- **NullPointerExceptions**: Always verify `current != null` and `current.next != null` before dereferencing.', 3),
(14, 'SUMMARY', 'Key Takeaways',
'- Insertions and deletions at the head are instantaneous: **O(1)**.
- Accessing an element by index takes **O(n)** time because you must traverse node by node starting from head.
- Does not require a pre-allocated fixed memory size like static arrays.', 4);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(14, 'python', 'Singly Linked List in Python',
'class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

head = Node(10)
head.next = Node(20)
head.next.next = Node(30)

current = head
while current:
    print(current.data, end=" -> ")
    current = current.next
print("None")',
'We define a Node class with data and next. We chain three nodes (10, 20, 30) together and traverse them with a while loop.',
'10 -> 20 -> 30 -> None', 1),
(14, 'java', 'Singly Linked List in Java',
'class Node {
    int data;
    Node next;
    Node(int d) { this.data = d; }
}
public class Main {
    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);

        Node curr = head;
        while (curr != null) {
            System.out.print(curr.data + " -> ");
            curr = curr.next;
        }
        System.out.println("null");
    }
}',
'Each Node instance has an integer value and a next Node reference. We traverse until curr is null.',
'10 -> 20 -> 30 -> null', 2),
(14, 'c', 'Singly Linked List in C',
'#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    struct Node* second = (struct Node*)malloc(sizeof(struct Node));
    head->data = 10;
    head->next = second;
    second->data = 20;
    second->next = NULL;

    struct Node* curr = head;
    while (curr != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\n");
    return 0;
}',
'In C we allocate memory for each node on the heap using malloc and link them via pointers.',
'10 -> 20 -> NULL', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(14, '[{"label":"Head Node","caption":"Create head node with value 10. Next points to null.","boxes":[{"id":"n1","label":"Head [10]","value":"data: 10","highlight":true}]},{"label":"Link Node 2","caption":"Create node 20. Head.next points to node 20.","boxes":[{"id":"n1","label":"Head [10]","value":"next ->","highlight":false},{"id":"n2","label":"Node [20]","value":"data: 20","highlight":true}]},{"label":"Link Node 3","caption":"Create node 30. Node 20 points to 30. Node 30 points to null.","boxes":[{"id":"n1","label":"[10]","value":"next ->","highlight":false},{"id":"n2","label":"[20]","value":"next ->","highlight":false},{"id":"n3","label":"[30]","value":"next: null","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 15: Stacks (LIFO)
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(15, 'ANALOGY', 'Real-Life Analogy: The Stack of Plates',
'Think of a stack of clean plates in a cafeteria.
- When a dishwasher adds a plate, it goes on the **top** (**Push**).
- When a student takes a plate, they take it from the **top** (**Pop**).
The plate placed last is the first one taken. This is **LIFO (Last In, First Out)**.', 1),
(15, 'CONCEPT', 'Core Stack Operations',
'A stack supports three primary O(1) time operations:
- **`push(x)`**: Place item x on top of the stack.
- **`pop()`**: Remove and return the top item.
- **`peek()` / `top()`**: View the top item without removing it.
- **`isEmpty()`**: Check whether the stack contains any items.

### Where Stacks are Used
- **Undo / Redo** feature in code editors.
- **Browser Back Button** history.
- **Syntax checking**: Validating balanced parentheses `({[]})`.
- **Function Call Stack**: How computers track recursive calls.', 2),
(15, 'MISTAKES', 'Common Mistakes',
'- Calling `pop()` on an empty stack triggers a **Stack Underflow** error. Always check `!isEmpty()` first!
- Trying to access middle elements directly — a stack only gives you direct access to the top.', 3),
(15, 'SUMMARY', 'Key Takeaways',
'- Stack follows LIFO: Last In, First Out.
- Push, Pop, and Peek are all strictly **O(1)** time complexity.
- Essential for parentheses matching, monotonic stacks, and DFS traversal.', 4);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(15, 'python', 'Stack using Python List',
'stack = []
stack.append(10)  # push
stack.append(20)
stack.append(30)

print("Top element:", stack[-1])  # peek
print("Popped:", stack.pop())     # pop 30
print("Popped:", stack.pop())     # pop 20
print("Remaining:", stack)',
'Python lists naturally function as stacks using append() for push and pop() for pop.',
'Top element: 30
Popped: 30
Popped: 20
Remaining: [10]', 1),
(15, 'java', 'Stack in Java',
'import java.util.Stack;
public class Main {
    public static void main(String[] args) {
        Stack<Integer> st = new Stack<>();
        st.push(10);
        st.push(20);
        st.push(30);

        System.out.println("Top: " + st.peek());
        System.out.println("Popped: " + st.pop());
        System.out.println("Is empty: " + st.isEmpty());
    }
}',
'Java provides a built-in java.util.Stack class with push(), pop(), and peek().',
'Top: 30
Popped: 30
Is empty: false', 2),
(15, 'c', 'Stack using Array in C',
'#include <stdio.h>
#define MAX 100

int stack[MAX];
int top = -1;

void push(int x) { stack[++top] = x; }
int pop() { return stack[top--]; }
int peek() { return stack[top]; }

int main() {
    push(10);
    push(20);
    push(30);
    printf("Top: %d\n", peek());
    printf("Popped: %d\n", pop());
    return 0;
}',
'An integer top variable tracks the highest index in the stack array.',
'Top: 30
Popped: 30', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(15, '[{"label":"Push 10","caption":"Push 10 onto the bottom of the stack.","boxes":[{"id":"s1","label":"Top -> [10]","value":"10","highlight":true}]},{"label":"Push 20","caption":"Push 20 on top of 10. Top moves to 20.","boxes":[{"id":"s2","label":"Top -> [20]","value":"20","highlight":true},{"id":"s1","label":"[10]","value":"10","highlight":false}]},{"label":"Pop 20","caption":"Pop removes the topmost item (20). Top returns to 10.","boxes":[{"id":"s1","label":"Top -> [10]","value":"10","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 16: Queues (FIFO)
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(16, 'ANALOGY', 'Real-Life Analogy: The Ticket Counter Queue',
'Think of a movie theater ticket counter line.
The first customer to arrive stands at the front and is served first. New people line up at the **rear**.
Nobody gets to jump the line. This is **FIFO (First In, First Out)**.', 1),
(16, 'CONCEPT', 'Core Queue Operations',
'A Queue maintains two ends: **Front** (head) and **Rear** (tail):
- **`enqueue(x)`**: Insert x at the rear.
- **`dequeue()`**: Remove and return the front element.
- **`peek()`**: Look at the front element without removing it.

### Variations:
- **Circular Queue**: Avoids wasted memory in fixed arrays by wrapping around `(rear + 1) % capacity`.
- **Deque (Double-Ended Queue)**: Allows push and pop at both front and back.
- **Priority Queue**: Elements leave based on priority rather than arrival order.', 2),
(16, 'MISTAKES', 'Common Mistakes',
'- Implementing a queue using a basic dynamic array without pointers: shifting all elements on dequeue causes an expensive **O(n)** time cost. Use linked lists or two pointers for true **O(1)**.', 3),
(16, 'SUMMARY', 'Key Takeaways',
'- FIFO: First In, First Out.
- Enqueue and Dequeue run in **O(1)** time.
- Standard engine behind Breadth-First Search (BFS) and OS task schedulers.', 4);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(16, 'python', 'Queue using collections.deque',
'from collections import deque

q = deque()
q.append(10)  # enqueue
q.append(20)
q.append(30)

print("Front:", q[0])
print("Dequeued:", q.popleft())  # O(1) dequeue
print("Dequeued:", q.popleft())
print("Remaining:", list(q))',
'collections.deque provides true O(1) appends and poplefts.',
'Front: 10
Dequeued: 10
Dequeued: 20
Remaining: [30]', 1),
(16, 'java', 'Queue in Java using LinkedList',
'import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<Integer> q = new LinkedList<>();
        q.offer(10); // enqueue
        q.offer(20);
        q.offer(30);

        System.out.println("Front: " + q.peek());
        System.out.println("Dequeued: " + q.poll());
        System.out.println("Size: " + q.size());
    }
}',
'Queue is an interface in Java, commonly implemented by LinkedList or ArrayDeque.',
'Front: 10
Dequeued: 10
Size: 2', 2),
(16, 'c', 'Queue in C',
'#include <stdio.h>
#define SIZE 5

int q[SIZE], front = 0, rear = 0;

void enqueue(int val) { q[rear++] = val; }
int dequeue() { return q[front++]; }

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    printf("Dequeued: %d\n", dequeue());
    printf("Dequeued: %d\n", dequeue());
    return 0;
}',
'Front and rear index pointers advance as elements arrive and depart.',
'Dequeued: 10
Dequeued: 20', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(16, '[{"label":"Enqueue 10","caption":"10 enters the queue at the rear. Front and Rear point to 10.","boxes":[{"id":"q1","label":"Front/Rear [10]","value":"10","highlight":true}]},{"label":"Enqueue 20, 30","caption":"20 and 30 join behind 10. Front stays at 10; Rear moves to 30.","boxes":[{"id":"q1","label":"Front [10]","value":"10","highlight":false},{"id":"q2","label":"[20]","value":"20","highlight":false},{"id":"q3","label":"Rear [30]","value":"30","highlight":true}]},{"label":"Dequeue","caption":"10 leaves the queue first (FIFO). Front moves to 20.","boxes":[{"id":"q2","label":"Front [20]","value":"20","highlight":true},{"id":"q3","label":"Rear [30]","value":"30","highlight":false}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 17: Hashing & Hash Maps
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(17, 'ANALOGY', 'Real-Life Analogy: The Coat Check Room',
'Imagine going to an event where you hand over your coat. You receive a coat check tag numbered **42**. When leaving, you show tag 42, and the attendant goes straight to hook #42.
They do not inspect every single coat one-by-one! This is **Hashing**: converting a key into a direct address for immediate O(1) access.', 1),
(17, 'CONCEPT', 'How Hash Maps Work',
'A **Hash Map** stores key-value pairs:
1. **Hash Function**: Takes a key (e.g. `"apple"`) and computes an integer bucket index.
2. **Buckets Array**: The computed index determines where the pair is stored.
3. **Collision Handling**: If two different keys produce the same hash index:
   - **Chaining**: Store linked list of pairs at the same bucket.
   - **Open Addressing**: Probe the next open slot in the array.

### Time Complexities:
- Search, Insertion, Deletion: **O(1)** on average (**O(n)** worst-case if all collide).', 2),
(17, 'MISTAKES', 'Common Mistakes',
'- Using mutable objects (like lists or arrays) as hash keys. If the object changes, its hash changes, making it unfindable.', 3),
(17, 'SUMMARY', 'Key Takeaways',
'- Hash Tables provide average **O(1)** lookups.
- Known as `dict` in Python, `HashMap` in Java, and `unordered_map` in C++.
- Primary choice for frequency counters and Two Sum problems.', 4);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(17, 'python', 'Counting Frequencies using Hash Map',
'words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
freq = {}

for w in words:
    freq[w] = freq.get(w, 0) + 1

for fruit, count in freq.items():
    print(f"{fruit}: {count}")',
'We track counts of distinct items in O(n) total time using dict lookups.',
'apple: 3
banana: 2
cherry: 1', 1),
(17, 'java', 'HashMap in Java',
'import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("Alice", 95);
        map.put("Bob", 82);

        System.out.println("Alice score: " + map.get("Alice"));
        System.out.println("Contains Bob: " + map.containsKey("Bob"));
    }
}',
'HashMap stores String keys mapped to Integer values with O(1) lookup.',
'Alice score: 95
Contains Bob: true', 2),
(17, 'c', 'Simple Hash Table in C',
'#include <stdio.h>
#define SIZE 10

int table[SIZE];

int hash(int key) { return key % SIZE; }

void insert(int key) { table[hash(key)] = key; }

int main() {
    insert(15); // index 5
    insert(28); // index 8
    printf("Item at index 5: %d\n", table[hash(15)]);
    printf("Item at index 8: %d\n", table[hash(28)]);
    return 0;
}',
'Modulo hash function maps numbers to bucket slots.',
'Item at index 5: 15
Item at index 8: 28', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(17, '[{"label":"Hash key ''apple''","caption":"Key ''apple'' passes through hash function -> index 3.","boxes":[{"id":"h1","label":"hash(''apple'')","value":"Index: 3","highlight":true}]},{"label":"Store in Bucket 3","caption":"Store (''apple'', 3) inside bucket array slot 3.","boxes":[{"id":"b3","label":"Bucket [3]","value":"apple: 3","highlight":true}]},{"label":"Lookup in O(1)","caption":"Looking up ''apple'' jumps straight to index 3 without checking slots 0, 1, 2!","boxes":[{"id":"b3","label":"Bucket [3]","value":"apple: 3 ✓","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 18: Binary Search on Answers
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(18, 'ANALOGY', 'Real-Life Analogy: Guessing the Weight Capacity',
'Imagine testing a bridge to see the maximum truck weight it can support without breaking.
You don''t test 1 ton, 2 tons, 3 tons... Instead you test 50 tons. If it holds, the answer is in the upper half. If it cracks, the answer is in the lower half.
This is **Binary Search on the Answer Space**.', 1),
(18, 'CONCEPT', 'When to Apply Binary Search on Answer',
'Use this technique when:
1. The question asks for the **minimum possible maximum** or **maximum possible minimum**.
2. The problem satisfies a **monotonic condition**: If weight $X$ works, every weight $> X$ also works (or vice versa).
3. We define an `isValid(mid)` helper function that checks feasibility in $O(n)$ time.

Total complexity: $O(n \times \log(\text{Range}))$.', 2),
(18, 'MISTAKES', 'Common Mistakes',
'- Picking incorrect bounds for `low` and `high`. Ensure the true optimal answer is guaranteed to lie within `[low, high]`.', 3),
(18, 'SUMMARY', 'Key Takeaways',
'- Transforms an optimization problem into a series of verification checks.
- Found in classic problems like *Allocate Books*, *Koko Eating Bananas*, and *Aggressive Cows*.', 4);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(18, 'python', 'Square Root using Binary Search',
'def my_sqrt(x):
    low, high = 0, x
    ans = 0
    while low <= high:
        mid = (low + high) // 2
        if mid * mid <= x:
            ans = mid
            low = mid + 1
        else:
            high = mid - 1
    return ans

print("Sqrt of 16:", my_sqrt(16))
print("Sqrt of 28:", my_sqrt(28))',
'We binary search the answer space 0 to x. mid*mid <= x is our monotonic predicate.',
'Sqrt of 16: 4
Sqrt of 28: 5', 1),
(18, 'java', 'Integer Square Root in Java',
'public class Main {
    static int mySqrt(int x) {
        long low = 0, high = x, ans = 0;
        while (low <= high) {
            long mid = low + (high - low) / 2;
            if (mid * mid <= x) {
                ans = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return (int)ans;
    }
    public static void main(String[] args) {
        System.out.println("Sqrt(50): " + mySqrt(50));
    }
}',
'Using long avoids potential integer overflow on mid * mid.',
'Sqrt(50): 7', 2),
(18, 'c', 'Integer Square Root in C',
'#include <stdio.h>

int mySqrt(int x) {
    long long low = 0, high = x, ans = 0;
    while (low <= high) {
        long long mid = low + (high - low) / 2;
        if (mid * mid <= x) {
            ans = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return (int)ans;
}

int main() {
    printf("Sqrt(100): %d\n", mySqrt(100));
    return 0;
}',
'C implementation using long long to guard against multiplication overflow.',
'Sqrt(100): 10', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(18, '[{"label":"Range [0, 16]","caption":"Find sqrt(16). Range is [0, 16]. Mid = 8.","boxes":[{"id":"m","label":"mid: 8","value":"8*8=64 > 16","highlight":true}]},{"label":"Halve to [0, 7]","caption":"64 is too large. High becomes 7. Mid = 3.","boxes":[{"id":"m","label":"mid: 3","value":"3*3=9 <= 16","highlight":true}]},{"label":"Answer: 4","caption":"Low becomes 4. Mid = 4. 4*4=16 <= 16 -> Best Answer = 4!","boxes":[{"id":"m","label":"mid: 4","value":"4*4=16 ✓","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 19: Two Pointers & Sliding Window
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(19, 'ANALOGY', 'Real-Life Analogy: The Camera Zoom Window',
'Imagine framing a moving group of people in a camera lens. Instead of walking around setting up from scratch every time, you slide the viewfinder horizontally and adjust the zoom boundary.
In an array, **Two Pointers** adjust window edges in $O(n)$ time without recalculating from scratch.', 1),
(19, 'CONCEPT', 'Two Pointer Variations',
'1. **Opposite Ends**: One pointer at `left = 0`, another at `right = n - 1`. Move towards center (e.g. *Two Sum in Sorted Array*, *Valid Palindrome*).
2. **Fast & Slow**: One pointer moves faster than the other (e.g. *Cycle Detection*, *Remove Duplicates*).
3. **Sliding Window**: A dynamic subarray `[L, R]`. Expand `R` to satisfy a condition; contract `L` when a constraint is violated.', 2),
(19, 'MISTAKES', 'Common Mistakes',
'- Forgetting to sort before applying the opposite-ends two pointer approach for pair sums.', 3),
(19, 'SUMMARY', 'Key Takeaways',
'- Replaces brute force $O(n^2)$ nested loops with a clean single-pass **$O(n)$** algorithm.', 4);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(19, 'python', 'Two Sum in Sorted Array',
'def two_sum_sorted(arr, target):
    l, r = 0, len(arr) - 1
    while l < r:
        s = arr[l] + arr[r]
        if s == target:
            return (l, r)
        elif s < target:
            l += 1
        else:
            r -= 1
    return None

arr = [2, 7, 11, 15]
print("Indices for 9:", two_sum_sorted(arr, 9))',
'Left pointer increments if sum is too small; right pointer decrements if sum is too large.',
'Indices for 9: (0, 1)', 1),
(19, 'java', 'Two Sum in Sorted Array in Java',
'public class Main {
    static int[] twoSum(int[] arr, int target) {
        int l = 0, r = arr.length - 1;
        while (l < r) {
            int sum = arr[l] + arr[r];
            if (sum == target) return new int[]{l, r};
            else if (sum < target) l++;
            else r--;
        }
        return new int[]{-1, -1};
    }
    public static void main(String[] args) {
        int[] res = twoSum(new int[]{1, 3, 4, 8, 12}, 11);
        System.out.println("Indices: " + res[0] + ", " + res[1]);
    }
}',
'Single-pass O(n) scan from both ends simultaneously.',
'Indices: 1, 3', 2),
(19, 'c', 'Two Sum in Sorted Array in C',
'#include <stdio.h>

int main() {
    int arr[] = {2, 7, 11, 15};
    int n = 4, target = 9;
    int l = 0, r = n - 1;

    while (l < r) {
        int sum = arr[l] + arr[r];
        if (sum == target) {
            printf("Found at indices: %d and %d\n", l, r);
            return 0;
        } else if (sum < target) l++;
        else r--;
    }
    printf("Not found\n");
    return 0;
}',
'C implementation using two index variables advancing towards the middle.',
'Found at indices: 0 and 1', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(19, '[{"label":"Start [l=0, r=3]","caption":"Target: 9. Left at arr[0]=2, Right at arr[3]=15. Sum = 17 (Too big!).","boxes":[{"id":"l","label":"[L] 2","value":"2","highlight":true},{"id":"m1","label":"7","value":"7","highlight":false},{"id":"m2","label":"11","value":"11","highlight":false},{"id":"r","label":"[R] 15","value":"15","highlight":true}]},{"label":"Decrement Right","caption":"Sum was 17 > 9, so move Right pointer left to index 2 (11). Sum = 13 (Still too big!).","boxes":[{"id":"l","label":"[L] 2","value":"2","highlight":true},{"id":"m1","label":"7","value":"7","highlight":false},{"id":"r","label":"[R] 11","value":"11","highlight":true}]},{"label":"Match Found!","caption":"Move Right pointer left to index 1 (7). Sum = 2 + 7 = 9. Match found!","boxes":[{"id":"l","label":"[L] 2","value":"2","highlight":true},{"id":"r","label":"[R] 7","value":"7","highlight":true}]}]');


-- =============================================================
-- 3. LEVEL 4 TOPIC SECTIONS, EXAMPLES & VISUALIZATIONS
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- TOPIC 20: Binary Trees & Traversals
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(20, 'ANALOGY', 'Real-Life Analogy: The Corporate Hierarchy',
'Think of a corporate organization chart. The CEO is at the top (**Root**). Under the CEO are two Vice Presidents (Left and Right Children), who each supervise their own team.
Trees represent hierarchical relations rather than linear sequences.', 1),
(20, 'CONCEPT', 'Tree Structure & The 3 Depth Traversals',
'A Binary Tree has nodes where each node has at most **two children** (`left` and `right`).

### The Three Classic Depth Traversals:
1. **Inorder (Left -> Root -> Right)**: Visits values in sorted order for BSTs.
2. **Preorder (Root -> Left -> Right)**: Useful for cloning or serializing a tree.
3. **Postorder (Left -> Right -> Root)**: Useful for deleting nodes from leaves up.', 2),
(20, 'SUMMARY', 'Key Takeaways',
'- Trees are naturally recursive structures.
- Breadth-First traversal (Level Order) uses a Queue; Depth-First traversal uses Recursion/Stack.', 3);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(20, 'python', 'Binary Tree Inorder Traversal',
'class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)

def inorder(node):
    if not node: return
    inorder(node.left)
    print(node.val, end=" ")
    inorder(node.right)

print("Inorder Traversal:")
inorder(root)',
'Recursive traversal visits the left subtree, then prints current node, then visits right subtree.',
'Inorder Traversal:
2 1 3', 1),
(20, 'java', 'Binary Tree Inorder in Java',
'class Node {
    int val;
    Node left, right;
    Node(int v) { val = v; }
}
public class Main {
    static void inorder(Node root) {
        if (root == null) return;
        inorder(root.left);
        System.out.print(root.val + " ");
        inorder(root.right);
    }
    public static void main(String[] args) {
        Node root = new Node(1);
        root.left = new Node(2);
        root.right = new Node(3);
        inorder(root);
    }
}',
'Java node structure with left and right child pointers.',
'2 1 3', 2),
(20, 'c', 'Binary Tree Traversal in C',
'#include <stdio.h>
#include <stdlib.h>

struct Node {
    int val;
    struct Node *left, *right;
};

void inorder(struct Node* root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->val);
    inorder(root->right);
}

int main() {
    struct Node* root = (struct Node*)malloc(sizeof(struct Node));
    root->val = 1;
    root->left = (struct Node*)malloc(sizeof(struct Node));
    root->left->val = 2; root->left->left = root->left->right = NULL;
    root->right = (struct Node*)malloc(sizeof(struct Node));
    root->right->val = 3; root->right->left = root->right->right = NULL;

    inorder(root);
    return 0;
}',
'Pointers in C traversing the binary tree recursively.',
'2 1 3', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(20, '[{"label":"Root Node 1","caption":"Start at root node 1.","boxes":[{"id":"r","label":"Root: 1","value":"1","highlight":true}]},{"label":"Traverse Left Child","caption":"Inorder visits Left child (2) first.","boxes":[{"id":"l","label":"Left: 2","value":"2","highlight":true},{"id":"r","label":"Root: 1","value":"1","highlight":false}]},{"label":"Traverse Right Child","caption":"Print 1, then visit Right child (3). Result: 2 1 3.","boxes":[{"id":"l","label":"[2]","value":"Printed","highlight":false},{"id":"r","label":"[1]","value":"Printed","highlight":false},{"id":"rc","label":"Right: 3","value":"3","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 21: Binary Search Trees (BST)
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(21, 'ANALOGY', 'Real-Life Analogy: A Well-Organized Library Shelf',
'Imagine a library where for any author on the shelf:
- Every author with a name starting earlier in the alphabet is placed on the **left**.
- Every author with a name starting later in the alphabet is placed on the **right**.
Finding any author requires only $O(\log n)$ decisions.', 1),
(21, 'CONCEPT', 'The BST Property',
'For every node $X$ in a Binary Search Tree:
- All values in the left subtree are strictly **$< X$**.
- All values in the right subtree are strictly **$> X$**.

Searching, inserting, and deleting in a balanced BST takes **$O(\log n)$** time.', 2),
(21, 'SUMMARY', 'Key Takeaways',
'- Inorder traversal of a BST always yields keys in ascending sorted order.
- Skewed BSTs can degrade to $O(n)$ without self-balancing mechanisms (AVL/Red-Black).', 3);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(21, 'python', 'BST Search in Python',
'class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def search_bst(root, target):
    if not root or root.val == target:
        return root
    if target < root.val:
        return search_bst(root.left, target)
    return search_bst(root.right, target)

root = Node(50)
root.left = Node(30)
root.right = Node(70)

found = search_bst(root, 70)
print("Found value:", found.val if found else "Not found")',
'Target compared with root: if smaller go left, if larger go right.',
'Found value: 70', 1),
(21, 'java', 'BST Search in Java',
'class Node { int val; Node left, right; Node(int v) { val = v; } }
public class Main {
    static boolean search(Node root, int val) {
        if (root == null) return false;
        if (root.val == val) return true;
        return val < root.val ? search(root.left, val) : search(root.right, val);
    }
    public static void main(String[] args) {
        Node root = new Node(50);
        root.left = new Node(30);
        root.right = new Node(70);
        System.out.println("Contains 30: " + search(root, 30));
    }
}',
'Logarithmic time lookup across the BST branches.',
'Contains 30: true', 2),
(21, 'c', 'BST Search in C',
'#include <stdio.h>
#include <stdlib.h>

struct Node { int val; struct Node *left, *right; };

int search(struct Node* root, int val) {
    if (!root) return 0;
    if (root->val == val) return 1;
    return val < root->val ? search(root->left, val) : search(root->right, val);
}

int main() {
    struct Node* root = (struct Node*)malloc(sizeof(struct Node));
    root->val = 50; root->left = root->right = NULL;
    printf("Found 50: %d\n", search(root, 50));
    return 0;
}',
'Returns 1 if present, 0 if absent in O(h) where h is tree height.',
'Found 50: 1', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(21, '[{"label":"Root 50","caption":"Search for 70. Compare with root 50. 70 > 50 -> Go Right!","boxes":[{"id":"r","label":"Root: 50","value":"70 > 50 -> Right","highlight":true}]},{"label":"Right Child 70","caption":"Examine right child 70. 70 == 70 -> Match Found in 2 steps!","boxes":[{"id":"rc","label":"Node: 70","value":"Found ✓","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 22: Heaps & Priority Queues
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(22, 'ANALOGY', 'Real-Life Analogy: Hospital Emergency Room Triage',
'In an emergency room, patients are not treated based on arrival time. A critical patient arriving at 10:05 AM is treated before a minor cut arrived at 9:30 AM.
A **Priority Queue** ensures the highest-priority item is always at the front.', 1),
(22, 'CONCEPT', 'Min-Heap vs Max-Heap',
'A **Heap** is a complete binary tree:
- **Min-Heap**: Root is always the smallest element.
- **Max-Heap**: Root is always the largest element.
- Insert: $O(\log n)$
- Extract Min/Max: $O(\log n)$
- Peek Min/Max: **$O(1)$**', 2),
(22, 'SUMMARY', 'Key Takeaways',
'- Efficiently solves Top K Frequent Elements, Merge K Sorted Lists, and Dijkstra''s algorithm.', 3);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(22, 'python', 'Min-Heap using heapq',
'import heapq

heap = []
heapq.heappush(heap, 40)
heapq.heappush(heap, 10)
heapq.heappush(heap, 30)

print("Smallest (Peek):", heap[0])
print("Extracted:", heapq.heappop(heap))
print("Next smallest:", heapq.heappop(heap))',
'Python heapq maintains a Min-Heap automatically inside a list.',
'Smallest (Peek): 10
Extracted: 10
Next smallest: 30', 1),
(22, 'java', 'PriorityQueue in Java',
'import java.util.PriorityQueue;

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        pq.offer(40);
        pq.offer(10);
        pq.offer(30);

        System.out.println("Extracted: " + pq.poll());
        System.out.println("Extracted: " + pq.poll());
    }
}',
'Java PriorityQueue defaults to a Min-Heap.',
'Extracted: 10
Extracted: 30', 2),
(22, 'c', 'Heap Concept in C',
'#include <stdio.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int main() {
    int heap[] = {10, 40, 30}; // min-heap root at index 0
    printf("Min element: %d\n", heap[0]);
    return 0;
}',
'Heap root element is stored at index 0 in an array representation.',
'Min element: 10', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(22, '[{"label":"Insert elements","caption":"Insert 40, 10, 30. Min-heap bubbles 10 to root.","boxes":[{"id":"h0","label":"Root [10]","value":"Min: 10","highlight":true},{"id":"h1","label":"Child [40]","value":"40","highlight":false},{"id":"h2","label":"Child [30]","value":"30","highlight":false}]},{"label":"Extract Min","caption":"Extract min removes 10 in O(log n). 30 becomes new root.","boxes":[{"id":"h0","label":"New Root [30]","value":"Min: 30","highlight":true},{"id":"h1","label":"Child [40]","value":"40","highlight":false}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 23: Graphs & BFS / DFS
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(23, 'ANALOGY', 'Real-Life Analogy: Social Networks and Flight Maps',
'Think of flight routes between cities or friendships on LinkedIn. Cities and users are **Vertices** (Nodes); flight connections and friendships are **Edges**.
Unlike trees, graphs can contain **cycles**.', 1),
(23, 'CONCEPT', 'BFS vs DFS Traversal',
'1. **Breadth-First Search (BFS)**:
   - Explores neighbors layer by layer like water ripples.
   - Uses a **Queue**.
   - Finds the **shortest path** in unweighted graphs.
2. **Depth-First Search (DFS)**:
   - Explores as deep as possible down a path before backtracking.
   - Uses **Recursion** or a **Stack**.', 2),
(23, 'SUMMARY', 'Key Takeaways',
'- Graph representation: Adjacency List (space $O(V+E)$) or Adjacency Matrix ($O(V^2)$).
- Always maintain a `visited` set to avoid infinite loops from cycles.', 3);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(23, 'python', 'Graph BFS Traversal',
'from collections import deque

graph = {
    0: [1, 2],
    1: [2],
    2: [0, 3],
    3: [3]
}

def bfs(start):
    visited = set([start])
    q = deque([start])
    while q:
        node = q.popleft()
        print(node, end=" ")
        for nbr in graph.get(node, []):
            if nbr not in visited:
                visited.add(nbr)
                q.append(nbr)

print("BFS traversal from 2:")
bfs(2)',
'Breadth-first search using queue and visited set.',
'BFS traversal from 2:
2 0 3 1', 1),
(23, 'java', 'Graph BFS in Java',
'import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<List<Integer>> adj = Arrays.asList(
            Arrays.asList(1, 2),
            Arrays.asList(0, 2),
            Arrays.asList(0, 1)
        );
        boolean[] visited = new boolean[3];
        Queue<Integer> q = new LinkedList<>();

        q.offer(0);
        visited[0] = true;
        System.out.print("BFS: ");
        while (!q.isEmpty()) {
            int u = q.poll();
            System.out.print(u + " ");
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.offer(v);
                }
            }
        }
    }
}',
'Adjacency list BFS in Java.',
'BFS: 0 1 2', 2),
(23, 'c', 'Simple Graph DFS in C',
'#include <stdio.h>

int visited[3] = {0};
int adj[3][3] = {
    {0, 1, 1},
    {1, 0, 0},
    {1, 0, 0}
};

void dfs(int u) {
    visited[u] = 1;
    printf("%d ", u);
    for (int v = 0; v < 3; v++) {
        if (adj[u][v] && !visited[v]) dfs(v);
    }
}

int main() {
    printf("DFS: ");
    dfs(0);
    return 0;
}',
'Recursive depth-first search on an adjacency matrix in C.',
'DFS: 0 1 2', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(23, '[{"label":"Start Node 0","caption":"BFS starts at Node 0. Add 0 to Queue.","boxes":[{"id":"v0","label":"Node 0","value":"Visited","highlight":true}]},{"label":"Explore Neighbors","caption":"Dequeue 0. Visit neighbors 1 and 2. Add both to Queue.","boxes":[{"id":"v1","label":"Node 1","value":"Visited","highlight":true},{"id":"v2","label":"Node 2","value":"Visited","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 24: Backtracking
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(24, 'ANALOGY', 'Real-Life Analogy: Exploring a Maze',
'When you navigate a maze and reach a dead end, you turn around, take a step back to the last fork in the road, and test a different corridor.
**Backtracking** explores candidate decisions, and **undoes** choices as soon as it determines they cannot lead to a valid solution.', 1),
(24, 'CONCEPT', 'The Backtracking Template',
'```python
def backtrack(candidate):
    if is_solution(candidate):
        output(candidate)
        return
    for choice in valid_choices():
        make_choice(choice)       # Choose
        backtrack(candidate)       # Explore
        undo_choice(choice)       # Unchoose (Backtrack!)
```', 2),
(24, 'SUMMARY', 'Key Takeaways',
'- Solves N-Queens, Sudoku, Subsets, Permutations, and Word Search.', 3);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(24, 'python', 'Generate Subsets using Backtracking',
'def subsets(nums):
    res = []
    def backtrack(start, path):
        res.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()  # Backtrack!
    backtrack(0, [])
    return res

print(subsets([1, 2]))',
'Choose an element, explore further, and pop it to backtrack.',
'[[], [1], [1, 2], [2]]', 1),
(24, 'java', 'Subsets in Java',
'import java.util.*;

public class Main {
    static void backtrack(int start, int[] nums, List<Integer> path) {
        System.out.println(path);
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(i + 1, nums, path);
            path.remove(path.size() - 1); // backtrack
        }
    }
    public static void main(String[] args) {
        backtrack(0, new int[]{1, 2}, new ArrayList<>());
    }
}',
'Backtracking with List add and remove.',
'[]
[1]
[1, 2]
[2]', 2),
(24, 'c', 'Simple Backtracking in C',
'#include <stdio.h>

void print_subsets(int arr[], int n, int idx, int subset[], int subSize) {
    if (idx == n) {
        printf("{ ");
        for (int i = 0; i < subSize; i++) printf("%d ", subset[i]);
        printf("}\n");
        return;
    }
    subset[subSize] = arr[idx];
    print_subsets(arr, n, idx + 1, subset, subSize + 1); // include
    print_subsets(arr, n, idx + 1, subset, subSize);     // exclude
}

int main() {
    int arr[] = {1, 2}, subset[2];
    print_subsets(arr, 2, 0, subset, 0);
    return 0;
}',
'Include/exclude binary choice tree in C.',
'{ 1 2 }
{ 1 }
{ 2 }
{ }', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(24, '[{"label":"Choice 1: Include 1","caption":"Add 1 to path: [1].","boxes":[{"id":"p","label":"Path","value":"[1]","highlight":true}]},{"label":"Choice 2: Include 2","caption":"Add 2 to path: [1, 2]. Solution found.","boxes":[{"id":"p","label":"Path","value":"[1, 2] ✓","highlight":true}]},{"label":"Backtrack","caption":"Pop 2 -> [1]. Pop 1 -> []. Explore branch with [2].","boxes":[{"id":"p","label":"Path","value":"[2] ✓","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 25: Greedy Algorithms
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(25, 'ANALOGY', 'Real-Life Analogy: Making Change with Coins',
'If you owe someone 38 cents using quarters (25c), dimes (10c), and pennies (1c):
You take the biggest coin possible first (25c), leaving 13c. Then a dime (10c), leaving 3c, then 3 pennies.
A **Greedy Algorithm** always picks the choice that looks best right now.', 1),
(25, 'CONCEPT', 'When Does Greedy Work?',
'Greedy works when:
1. **Greedy Choice Property**: A globally optimal solution can be reached by making locally optimal decisions.
2. **Optimal Substructure**: An optimal solution to the problem contains optimal solutions to subproblems.

Famous greedy algorithms:
- Activity Selection / Interval Scheduling
- Fractional Knapsack
- Huffman Coding
- Kruskal''s and Prim''s MST', 2),
(25, 'SUMMARY', 'Key Takeaways',
'- Extremely fast when applicable ($O(n \log n)$ due to sorting).
- Does not always yield optimal results for general problems (e.g. 0/1 Knapsack requires DP instead).', 3);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(25, 'python', 'Activity Selection Greedy',
'activities = [(1, 4), (3, 5), (0, 6), (5, 7), (8, 9)]
# Sort by finish time
activities.sort(key=lambda x: x[1])

count = 0
last_finish = -1
for start, finish in activities:
    if start >= last_finish:
        count += 1
        last_finish = finish

print("Maximum non-overlapping activities:", count)',
'Always picking the activity that finishes earliest leaves the most time for future activities.',
'Maximum non-overlapping activities: 3', 1),
(25, 'java', 'Coin Change Greedy in Java',
'import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] coins = {25, 10, 5, 1};
        int amount = 38;
        int count = 0;

        for (int c : coins) {
            count += amount / c;
            amount %= c;
        }
        System.out.println("Minimum coins needed: " + count);
    }
}',
'Greedy choice selects highest denominations first.',
'Minimum coins needed: 5', 2),
(25, 'c', 'Greedy Coin Change in C',
'#include <stdio.h>

int main() {
    int coins[] = {25, 10, 5, 1};
    int amount = 38, count = 0;

    for (int i = 0; i < 4; i++) {
        count += amount / coins[i];
        amount %= coins[i];
    }
    printf("Total coins: %d\n", count);
    return 0;
}',
'O(k) coin counting algorithm in C.',
'Total coins: 5', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(25, '[{"label":"Target 38c","caption":"Greedy takes largest coin <= 38: 25c. Remaining: 13c.","boxes":[{"id":"c1","label":"Pick: 25c","value":"Remainder: 13c","highlight":true}]},{"label":"Target 13c","caption":"Pick largest coin <= 13: 10c. Remaining: 3c.","boxes":[{"id":"c2","label":"Pick: 10c","value":"Remainder: 3c","highlight":true}]},{"label":"Target 3c","caption":"Pick 3 x 1c coins. Total coins used = 5.","boxes":[{"id":"c3","label":"Pick: 3 x 1c","value":"Done ✓ (5 coins)","highlight":true}]}]');


-- ─────────────────────────────────────────────────────────────
-- TOPIC 26: Dynamic Programming (DP)
-- ─────────────────────────────────────────────────────────────
INSERT INTO topic_sections (topic_id, section_type, title, content_markdown, sort_order) VALUES
(26, 'ANALOGY', 'Real-Life Analogy: Remembering Answers',
'Write `1 + 1 + 1 + 1 + 1` on paper.
Ask: *"What is that equal to?"* -> Answer: `5`.
Now add another `+ 1` to the end.
Ask: *"What is that equal to now?"*
You don''t recount from the beginning. You immediately say `6` because you **remembered** the previous result!
That is **Dynamic Programming**: remembering answers to subproblems so you never calculate them twice.', 1),
(26, 'CONCEPT', 'The Two Approaches to DP',
'1. **Top-Down with Memoization**:
   - Write natural recursion.
   - Store subproblem answers in a hash map or cache array.
2. **Bottom-Up with Tabulation**:
   - Solve base cases first in an iterative table array `dp[...]`.
   - Build up answer sequentially.

### The Hallmark Traits of DP:
- **Overlapping Subproblems**: Same subproblem solved repeatedly.
- **Optimal Substructure**: The optimal solution to the main problem is constructed from optimal subproblem answers.', 2),
(26, 'SUMMARY', 'Key Takeaways',
'- Transforms exponential $O(2^n)$ brute force into polynomial $O(n)$ or $O(n \times W)$.
- Solves Climbing Stairs, 0/1 Knapsack, Longest Common Subsequence (LCS), and Coin Change.', 3);

INSERT INTO topic_code_examples (topic_id, language, title, code, explanation, expected_output, sort_order) VALUES
(26, 'python', 'Climbing Stairs DP in Python',
'def climb_stairs(n):
    if n <= 2: return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

print("Ways to climb 5 stairs:", climb_stairs(5))',
'dp[i] = dp[i-1] + dp[i-2] computes ways to reach stair i from either 1 step or 2 steps below.',
'Ways to climb 5 stairs: 8', 1),
(26, 'java', 'Climbing Stairs DP in Java',
'public class Main {
    static int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
    public static void main(String[] args) {
        System.out.println("Ways to climb 5 stairs: " + climbStairs(5));
    }
}',
'Space-optimized bottom-up DP using only two variables.',
'Ways to climb 5 stairs: 8', 2),
(26, 'c', 'Fibonacci DP in C',
'#include <stdio.h>

int fib(int n) {
    int dp[50];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}

int main() {
    printf("Fibonacci(10): %d\n", fib(10));
    return 0;
}',
'Bottom-up dynamic programming tabulation array in C.',
'Fibonacci(10): 55', 3);

INSERT INTO topic_visualizations (topic_id, steps_json) VALUES
(26, '[{"label":"Base cases","caption":"dp[1] = 1, dp[2] = 2.","boxes":[{"id":"d1","label":"dp[1]","value":"1","highlight":false},{"id":"d2","label":"dp[2]","value":"2","highlight":false}]},{"label":"Calculate dp[3]","caption":"dp[3] = dp[2] + dp[1] = 2 + 1 = 3.","boxes":[{"id":"d3","label":"dp[3]","value":"3","highlight":true}]},{"label":"Calculate dp[4]","caption":"dp[4] = dp[3] + dp[2] = 3 + 2 = 5.","boxes":[{"id":"d4","label":"dp[4]","value":"5","highlight":true}]},{"label":"Result dp[5]","caption":"dp[5] = dp[4] + dp[3] = 5 + 3 = 8! Done in O(n) without recalculations.","boxes":[{"id":"d5","label":"dp[5]","value":"8 ✓","highlight":true}]}]');
