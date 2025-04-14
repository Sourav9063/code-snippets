## Key Functional Patterns & Techniques in JavaScript

Functional programming emphasizes pure functions, immutability, function composition, and avoiding side effects. Here are some core patterns and techniques used in functional JavaScript:

**1. Higher-Order Functions (HOFs)**

* **Concept:** Functions that operate on other functions, either by taking them as arguments or by returning them (or both). This is fundamental to many functional patterns.
* **Use Case:** Abstracting behavior, creating reusable function modifiers (like decorators), enabling strategies, callbacks, and more. Many built-in Array methods (`map`, `filter`, `reduce`) are HOFs.
* **Relation to OOP Patterns:** Enables functional implementations of Decorator, Strategy, Template Method, Factory (returning functions), Command (passing functions).
* **Example:**
    ```javascript
    // 1. Takes a function as an argument (e.g., a basic filter)
    const filterArray = (arr, predicateFn) => {
      const result = [];
      for (const item of arr) {
        if (predicateFn(item)) {
          result.push(item);
        }
      }
      return result;
    };
    const isEven = num => num % 2 === 0;
    console.log("Filtered Evens:", filterArray([1, 2, 3, 4, 5], isEven)); // Output: [ 2, 4 ]

    // 2. Returns a function (e.g., creates a multiplier function)
    const createMultiplier = (factor) => {
      // Returns a new function that remembers 'factor' (closure)
      return (number) => number * factor;
    };
    const double = createMultiplier(2);
    const triple = createMultiplier(3);
    console.log("Double 5:", double(5));   // Output: 10
    console.log("Triple 5:", triple(5));   // Output: 15

    // 3. Both (e.g., a simple function decorator)
    const withLogging = (fn) => {
        return (...args) => {
            console.log(`Calling ${fn.name || 'function'}...`);
            const result = fn(...args);
            console.log(`Result was: ${result}`);
            return result;
        };
    };
    const add = (a, b) => a + b;
    const loggedAdd = withLogging(add);
    loggedAdd(3, 4);
    ```

**2. Function Composition**

* **Concept:** The process of combining two or more functions to produce a new function or perform some computation. The output of one function becomes the input of the next.
* **Use Case:** Building complex operations from smaller, reusable pure functions. Improves readability and maintainability by breaking down logic.
* **Example:**
    ```javascript
    const pipe = (...fns) => (initialValue) => fns.reduce((acc, fn) => fn(acc), initialValue);
    // Or using manual composition for two functions:
    // const compose = (f, g) => (x) => f(g(x));

    const trim = (str) => str.trim();
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const addGreeting = (str) => `Hello, ${str}!`;

    // Compose the functions to create a transformation pipeline
    const formatNameAndGreet = pipe(
      trim,
      capitalize,
      addGreeting
    );

    const nameInput = "  alice  ";
    console.log(formatNameAndGreet(nameInput)); // Output: Hello, Alice!
    ```

**3. Closures / Module Pattern**

* **Concept:** A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). It gives you access to an outer function's scope from an inner function, even after the outer function has finished executing. This is the core mechanism behind data encapsulation and the Module Pattern in functional JS.
* **Use Case:** Creating private state and functions, implementing the Module Pattern, enabling techniques like currying and partial application, maintaining state in functional components (like React hooks).
* **Relation to OOP Patterns:** Provides encapsulation similar to private members in classes; enables functional Singleton implementations.
* **Example (Module Pattern):**
    ```javascript
    const createCounter = (initialValue = 0) => {
      let count = initialValue; // Private state captured by closure

      // Public API returned as an object literal
      return {
        increment: () => { count++; console.log(`Count is now ${count}`); },
        decrement: () => { count--; console.log(`Count is now ${count}`); },
        getValue: () => count
      };
    };

    const counter1 = createCounter();
    counter1.increment(); // Count is now 1
    counter1.increment(); // Count is now 2
    // console.log(counter1.count); // Error: count is not accessible (private)

    const counter2 = createCounter(10);
    counter2.decrement(); // Count is now 9
    console.log(counter1.getValue()); // 2
    console.log(counter2.getValue()); // 9 (independent state)
    ```

**4. Immutability**

* **Concept:** Not strictly a pattern, but a core principle. Data, once created, should not be changed. Operations that seem to modify data should instead return new data structures with the changes applied.
* **Use Case:** Preventing unintended side effects, simplifying state management (especially in complex applications like UIs with frameworks like React/Redux), enabling easier debugging and reasoning about state changes, facilitating features like undo/redo (Memento).
* **Example:**
    ```javascript
    // Mutable approach (avoid in FP)
    const userMut = { name: "Alice", roles: ["editor"] };
    // userMut.roles.push("admin"); // Modifies the original object

    // Immutable approach
    const userImmut = { name: "Bob", roles: ["viewer"] };

    // Create a *new* object with the added role
    const userWithAdmin = {
      ...userImmut, // Copy existing properties
      roles: [...userImmut.roles, "admin"] // Create a new roles array
    };

    console.log("Original User:", userImmut);      // Output: { name: 'Bob', roles: [ 'viewer' ] }
    console.log("Updated User:", userWithAdmin); // Output: { name: 'Bob', roles: [ 'viewer', 'admin' ] }

    // Example with array methods that return new arrays
    const numbers = [1, 2, 3, 4];
    const doubled = numbers.map(n => n * 2); // .map returns a new array
    const evens = numbers.filter(n => n % 2 === 0); // .filter returns a new array

    console.log("Original Numbers:", numbers); // [ 1, 2, 3, 4 ]
    console.log("Doubled:", doubled);         // [ 2, 4, 6, 8 ]
    console.log("Evens:", evens);             // [ 2, 4 ]
    ```

**5. Currying & Partial Application**

* **Concept:** Techniques for transforming functions:
    * **Currying:** Transforms a function that takes multiple arguments into a sequence of functions that each take a single argument.
    * **Partial Application:** Creates a new function by fixing (pre-filling) some of the arguments of an existing function.
* **Use Case:** Creating specialized functions from more general ones, improving code reuse, making function composition easier.
* **Example:**
    ```javascript
    // General function
    const add = (a, b, c) => a + b + c;

    // --- Partial Application ---
    // Create a function that always adds 10 as the first argument
    const add10 = (b, c) => add(10, b, c);
    console.log("Partial Application (add10):", add10(5, 3)); // Output: 18

    // --- Currying (manual example) ---
    const curryAdd = (a) => {
      return (b) => {
        return (c) => {
          return a + b + c;
        };
      };
    };
    const curriedAdd = curryAdd(10); // Fix 'a' to 10
    const curriedAdd10and5 = curriedAdd(5); // Fix 'b' to 5
    const result = curriedAdd10and5(3);    // Provide final argument 'c' = 3
    console.log("Currying Result:", result); // Output: 18

    // Usage: Creating specialized logging functions
    const log = (level, message) => console.log(`[${level.toUpperCase()}]: ${message}`);
    const logError = (message) => log('error', message); // Partially applied
    const logWarn = (message) => log('warn', message);   // Partially applied

    logError("Something went wrong!");
    logWarn("Potential issue detected.");
    ```

**6. Pure Functions**

* **Concept:** A function is pure if:
    1.  Its return value is solely determined by its input values (no dependency on external state like global variables, time, random numbers).
    2.  It causes no observable side effects (doesn't modify external state, log to console, write to disk, make network requests).
* **Use Case:** Core building blocks in FP. Pure functions are predictable, testable, easier to reason about, and facilitate techniques like memoization and parallelization.
* **Example:**
    ```javascript
    // Pure function: Output depends only on input, no side effects
    const calculateArea = (radius) => Math.PI * radius * radius;

    // Impure function: Depends on external state (Date.now)
    const getTimestampedMessage = (message) => `${Date.now()}: ${message}`;

    // Impure function: Causes a side effect (console.log)
    const logMessage = (message) => console.log(message);

    // Impure function: Modifies external state
    let counter = 0;
    const incrementGlobalCounter = () => { counter++; return counter; };

    console.log("Area:", calculateArea(5)); // Always the same for input 5
    console.log("Area:", calculateArea(5)); // Still the same
    console.log("Timestamped:", getTimestampedMessage("Test")); // Different each time
    ```
