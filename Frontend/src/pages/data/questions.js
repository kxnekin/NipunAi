export const fundamentalQuestions = [
  {
    id: 1,
    title: "Two Sum",
    description: "Return indices of two numbers that add up to target.",
    starterCode: `function twoSum(nums, target) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [2,7,11,15], target: 9 },
        expectedOutput: [0,1]
      },
      {
        input: { nums: [3,2,4], target: 6 },
        expectedOutput: [1,2]
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "HashMap"]
  },
  {
    id: 2,
    title: "Reverse String",
    description: "Reverse the given array of characters in-place.",
    starterCode: `function reverseString(s) {
  // Write your code here
}`,
    testCases: [
      {
        input: { s: ["h","e","l","l","o"] },
        expectedOutput: ["o","l","l","e","h"]
      },
      {
        input: { s: ["H","a","n","n","a","h"] },
        expectedOutput: ["h","a","n","n","a","H"]
      }
    ],
    difficulty: "Easy",
    tags: ["String", "Two-Pointers"]
  },
  {
    id: 3,
    title: "Valid Parentheses",
    description: "Determine if the input string containing '()[]{}' is valid.",
    starterCode: `function isValid(s) {
  // Write your code here
}`,
    testCases: [
      {
        input: { s: "()[]{}" },
        expectedOutput: true
      },
      {
        input: { s: "([)]" },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["String", "Stack"]
  },
  {
    id: 4,
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest sum.",
    starterCode: `function maxSubArray(nums) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [-2,1,-3,4,-1,2,1,-5,4] },
        expectedOutput: 6
      },
      {
        input: { nums: [1] },
        expectedOutput: 1
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"]
  },
  {
    id: 5,
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists into one new sorted list.",
    starterCode: `function mergeTwoLists(l1, l2) {
  // Write your code here
}`,
    testCases: [
      {
        input: { l1: [1,2,4], l2: [1,3,4] },
        expectedOutput: [1,1,2,3,4,4]
      },
      {
        input: { l1: [], l2: [0] },
        expectedOutput: [0]
      }
    ],
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"]
  },
  {
    id: 6,
    title: "Climbing Stairs",
    description: "Count the number of distinct ways to climb to the top of a staircase with n steps, taking either 1 or 2 steps at a time.",
    starterCode: `function climbStairs(n) {
  // Write your code here
}`,
    testCases: [
      {
        input: { n: 2 },
        expectedOutput: 2
      },
      {
        input: { n: 3 },
        expectedOutput: 3
      }
    ],
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Recursion"]
  },
  {
    id: 7,
    title: "Palindrome Number",
    description: "Determine whether an integer is a palindrome.",
    starterCode: `function isPalindrome(x) {
  // Write your code here
}`,
    testCases: [
      {
        input: { x: 121 },
        expectedOutput: true
      },
      {
        input: { x: -121 },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["Math"]
  },
  {
    id: 8,
    title: "Remove Duplicates from Sorted Array",
    description: "Remove duplicates in-place from a sorted array.",
    starterCode: `function removeDuplicates(nums) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [1,1,2] },
        expectedOutput: 2
      },
      {
        input: { nums: [0,0,1,1,1,2,2,3,3,4] },
        expectedOutput: 5
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Two-Pointers"]
  },
  {
    id: 9,
    title: "Best Time to Buy and Sell Stock",
    description: "Find the maximum profit from buying and selling a stock once.",
    starterCode: `function maxProfit(prices) {
  // Write your code here
}`,
    testCases: [
      {
        input: { prices: [7,1,5,3,6,4] },
        expectedOutput: 5
      },
      {
        input: { prices: [7,6,4,3,1] },
        expectedOutput: 0
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"]
  },
  {
    id: 10,
    title: "Intersection of Two Arrays II",
    description: "Compute the intersection of two arrays, where each element in the result should appear as many times as it shows in both arrays.",
    starterCode: `function intersect(nums1, nums2) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums1: [1,2,2,1], nums2: [2,2] },
        expectedOutput: [2,2]
      },
      {
        input: { nums1: [4,9,5], nums2: [9,4,9,8,4] },
        expectedOutput: [4,9]
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "HashMap", "Two-Pointers"]
  },
  {
    id: 11,
    title: "Linked List Cycle",
    description: "Determine if a linked list has a cycle.",
    starterCode: `function hasCycle(head) {
  // Write your code here
}`,
    testCases: [
      {
        input: { head: [3,2,0,-4], pos: 1 },
        expectedOutput: true
      },
      {
        input: { head: [1], pos: -1 },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["Linked List", "Two-Pointers"]
  },
  {
    id: 12,
    title: "Symmetric Tree",
    description: "Check if a binary tree is a mirror of itself.",
    starterCode: `function isSymmetric(root) {
  // Write your code here
}`,
    testCases: [
      {
        input: { root: [1,2,2,3,4,4,3] },
        expectedOutput: true
      },
      {
        input: { root: [1,2,2,null,3,null,3] },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["Binary Tree", "Recursion", "Breadth-First Search"]
  },
  {
    id: 13,
    title: "Invert Binary Tree",
    description: "Invert a binary tree.",
    starterCode: `function invertTree(root) {
  // Write your code here
}`,
    testCases: [
      {
        input: { root: [4,2,7,1,3,6,9] },
        expectedOutput: [4,7,2,9,6,3,1]
      },
      {
        input: { root: [2,1,3] },
        expectedOutput: [2,3,1]
      }
    ],
    difficulty: "Easy",
    tags: ["Binary Tree", "Recursion", "Breadth-First Search"]
  },
  {
    id: 14,
    title: "Maximum Depth of Binary Tree",
    description: "Find the maximum depth of a binary tree.",
    starterCode: `function maxDepth(root) {
  // Write your code here
}`,
    testCases: [
      {
        input: { root: [3,9,20,null,null,15,7] },
        expectedOutput: 3
      },
      {
        input: { root: [1,null,2] },
        expectedOutput: 2
      }
    ],
    difficulty: "Easy",
    tags: ["Binary Tree", "Recursion", "Breadth-First Search"]
  },
  {
    id: 15,
    title: "Breadth First Search of Graph",
    description: "Perform a BFS traversal of a graph starting from a given node.",
    starterCode: `function bfs(graph, start) {
  // Write your code here
}`,
    testCases: [
      {
        input: { graph: {0:[1,2],1:[2],2:[0,3],3:[3]}, start: 2 },
        expectedOutput: [2,0,3,1]
      },
      {
        input: { graph: {0:[1,2],1:[2],2:[0,3],3:[3]}, start: 0 },
        expectedOutput: [0,1,2,3]
      }
    ],
    difficulty: "Medium",
    tags: ["Graph", "Breadth-First Search"]
  },
  {
    id: 16,
    title: "Depth First Search of Graph",
    description: "Perform a DFS traversal of a graph starting from a given node.",
    starterCode: `function dfs(graph, start) {
  // Write your code here
}`,
    testCases: [
      {
        input: { graph: {0:[1,2],1:[2],2:[0,3],3:[3]}, start: 2 },
        expectedOutput: [2,0,1,3]
      },
      {
        input: { graph: {0:[1,2],1:[2],2:[0,3],3:[3]}, start: 0 },
        expectedOutput: [0,1,2,3]
      }
    ],
    difficulty: "Medium",
    tags: ["Graph", "Depth-First Search"]
  },
  {
    id: 17,
    title: "Valid Anagram",
    description: "Check if string t is an anagram of string s.",
    starterCode: `function isAnagram(s, t) {
  // Write your code here
}`,
    testCases: [
      {
        input: { s: "anagram", t: "nagaram" },
        expectedOutput: true
      },
      {
        input: { s: "rat", t: "car" },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["String", "HashMap", "Sorting"]
  },
  {
    id: 18,
    title: "Implement Stack using Array",
    description: "Implement a stack using an array.",
    starterCode: `class MyStack {
  // Implement push, pop, top, empty
}`,
    testCases: [
      {
        input: { operations: ["push", "push", "top", "pop", "empty"], values: [1, 2, null, null, null] },
        expectedOutput: [null, null, 2, 2, false]
      }
    ],
    difficulty: "Easy",
    tags: ["Stack", "Array", "Data Structure"]
  },
  {
    id: 19,
    title: "Implement Queue using Stack",
    description: "Implement a queue using two stacks.",
    starterCode: `class MyQueue {
  // Implement push, pop, peek, empty
}`,
    testCases: [
      {
        input: { operations: ["push", "push", "peek", "pop", "empty"], values: [1, 2, null, null, null] },
        expectedOutput: [null, null, 1, 1, false]
      }
    ],
    difficulty: "Easy",
    tags: ["Queue", "Stack", "Data Structure"]
  },
  {
    id: 20,
    title: "Majority Element",
    description: "Find the majority element in an array.",
    starterCode: `function majorityElement(nums) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [3,2,3] },
        expectedOutput: 3
      },
      {
        input: { nums: [2,2,1,1,1,2,2] },
        expectedOutput: 2
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "HashMap", "Sorting"]
  },
  {
    id: 21,
    title: "Remove Element",
    description: "Remove all instances of a value in-place from an array.",
    starterCode: `function removeElement(nums, val) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [3,2,2,3], val: 3 },
        expectedOutput: 2
      },
      {
        input: { nums: [0,1,2,2,3,0,4,2], val: 2 },
        expectedOutput: 5
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Two-Pointers"]
  },
  {
    id: 22,
    title: "Implement Linked List",
    description: "Implement a singly linked list.",
    starterCode: `class LinkedList {
  // Implement insert, delete, search
}`,
    testCases: [
      {
        input: { operations: ["insert", "insert", "delete", "search"], values: [1, 2, 1, 2] },
        expectedOutput: [null, null, null, 2]
      }
    ],
    difficulty: "Medium",
    tags: ["Linked List", "Data Structure"]
  },
  {
    id: 23,
    title: "Rotate Array",
    description: "Rotate an array to the right by k steps.",
    starterCode: `function rotate(nums, k) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [1,2,3,4,5,6,7], k: 3 },
        expectedOutput: [5,6,7,1,2,3,4]
      },
      {
        input: { nums: [-1,-100,3,99], k: 2 },
        expectedOutput: [3,99,-1,-100]
      }
    ],
    difficulty: "Medium",
    tags: ["Array"]
  },
  {
    id: 24,
    title: "Contains Duplicate",
    description: "Check if an array contains any duplicates.",
    starterCode: `function containsDuplicate(nums) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [1,2,3,1] },
        expectedOutput: true
      },
      {
        input: { nums: [1,2,3,4] },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "HashMap", "Sorting"]
  },
  {
    id: 25,
    title: "Single Number",
    description: "Find the single element that appears only once in an array where every other element appears twice.",
    starterCode: `function singleNumber(nums) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [2,2,1] },
        expectedOutput: 1
      },
      {
        input: { nums: [4,1,2,1,2] },
        expectedOutput: 4
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Bit Manipulation", "HashMap"]
  },
  {
    id: 26,
    title: "Pascal's Triangle",
    description: "Generate the first numRows of Pascal's triangle.",
    starterCode: `function generate(numRows) {
  // Write your code here
}`,
    testCases: [
      {
        input: { numRows: 5 },
        expectedOutput: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
      },
      {
        input: { numRows: 1 },
        expectedOutput: [[1]]
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"]
  },
  {
    id: 27,
    title: "Valid Sudoku",
    description: "Determine if a 9x9 Sudoku board is valid.",
    starterCode: `function isValidSudoku(board) {
  // Write your code here
}`,
    testCases: [
      {
        input: { board: [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]] },
        expectedOutput: true
      },
      {
        input: { board: [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]] },
        expectedOutput: false
      }
    ],
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "Matrix"]
  },
  {
    id: 28,
    title: "Minimum Depth of Binary Tree",
    description: "Find the minimum depth of a binary tree.",
    starterCode: `function minDepth(root) {
  // Write your code here
}`,
    testCases: [
      {
        input: { root: [3,9,20,null,null,15,7] },
        expectedOutput: 2
      },
      {
        input: { root: [2,null,3,null,4,null,5,null,6] },
        expectedOutput: 5
      }
    ],
    difficulty: "Easy",
    tags: ["Binary Tree", "Breadth-First Search", "Depth-First Search"]
  },
  {
    id: 29,
    title: "Symmetric Difference of Arrays",
    description: "Return elements in one array but not the other.",
    starterCode: `function symmetricDifference(nums1, nums2) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums1: [1,2,2,3], nums2: [2,3,4] },
        expectedOutput: [1,4]
      },
      {
        input: { nums1: [1,2,3], nums2: [1,2,3] },
        expectedOutput: []
      }
    ],
    difficulty: "Medium",
    tags: ["Array", "Set"]
  },
  {
    id: 30,
    title: "Plus One",
    description: "Increment a non-negative integer represented by an array of digits by one.",
    starterCode: `function plusOne(digits) {
  // Write your code here
}`,
    testCases: [
      {
        input: { digits: [1,2,3] },
        expectedOutput: [1,2,4]
      },
      {
        input: { digits: [9] },
        expectedOutput: [1,0]
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Math"]
  },
  {
    id: 31,
    title: "Move Zeroes",
    description: "Move all 0's to the end of an array while maintaining the relative order of non-zero elements.",
    starterCode: `function moveZeroes(nums) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [0,1,0,3,12] },
        expectedOutput: [1,3,12,0,0]
      },
      {
        input: { nums: [0,0,1] },
        expectedOutput: [1,0,0]
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Two-Pointers"]
  },
  {
    id: 32,
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    starterCode: `function reverseList(head) {
  // Write your code here
}`,
    testCases: [
      {
        input: { head: [1,2,3,4,5] },
        expectedOutput: [5,4,3,2,1]
      },
      {
        input: { head: [1,2] },
        expectedOutput: [2,1]
      }
    ],
    difficulty: "Easy",
    tags: ["Linked List", "Recursion", "Two-Pointers"]
  },
  {
    id: 33,
    title: "Remove Linked List Elements",
    description: "Remove all elements from a linked list that have a value equal to val.",
    starterCode: `function removeElements(head, val) {
  // Write your code here
}`,
    testCases: [
      {
        input: { head: [1,2,6,3,4,5,6], val: 6 },
        expectedOutput: [1,2,3,4,5]
      },
      {
        input: { head: [7,7,7,7], val: 7 },
        expectedOutput: []
      }
    ],
    difficulty: "Easy",
    tags: ["Linked List"]
  },
  {
    id: 34,
    title: "Symmetric Binary Tree",
    description: "Check if a binary tree is symmetric.",
    starterCode: `function isSymmetric(root) {
  // Write your code here
}`,
    testCases: [
      {
        input: { root: [1,2,2,3,4,4,3] },
        expectedOutput: true
      },
      {
        input: { root: [1,2,2,null,3,null,3] },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["Binary Tree", "Recursion", "Breadth-First Search"]
  },
  {
    id: 35,
    title: "Balanced Binary Tree",
    description: "Determine if a binary tree is height-balanced.",
    starterCode: `function isBalanced(root) {
  // Write your code here
}`,
    testCases: [
      {
        input: { root: [3,9,20,null,null,15,7] },
        expectedOutput: true
      },
      {
        input: { root: [1,2,2,3,3,null,null,4,4] },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["Binary Tree", "Depth-First Search"]
  },
  {
    id: 36,
    title: "Diameter of Binary Tree",
    description: "Find the length of the longest path between any two nodes in a binary tree.",
    starterCode: `function diameterOfBinaryTree(root) {
  // Write your code here
}`,
    testCases: [
      {
        input: { root: [1,2,3,4,5] },
        expectedOutput: 3
      },
      {
        input: { root: [1,2] },
        expectedOutput: 1
      }
    ],
    difficulty: "Easy",
    tags: ["Binary Tree", "Depth-First Search"]
  },
  {
    id: 37,
    title: "Maximum Product Subarray",
    description: "Find the contiguous subarray with the largest product.",
    starterCode: `function maxProduct(nums) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [2,3,-2,4] },
        expectedOutput: 6
      },
      {
        input: { nums: [-2,0,-1] },
        expectedOutput: 0
      }
    ],
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"]
  },
  {
    id: 38,
    title: "Best Time to Buy and Sell Stock II",
    description: "Find the maximum profit from buying and selling stock multiple times.",
    starterCode: `function maxProfit(prices) {
  // Write your code here
}`,
    testCases: [
      {
        input: { prices: [7,1,5,3,6,4] },
        expectedOutput: 7
      },
      {
        input: { prices: [1,2,3,4,5] },
        expectedOutput: 4
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming", "Greedy"]
  },
  {
    id: 39,
    title: "Contains Duplicate II",
    description: "Check if an array contains duplicates within a distance k.",
    starterCode: `function containsNearbyDuplicate(nums, k) {
  // Write your code here
}`,
    testCases: [
      {
        input: { nums: [1,2,3,1], k: 3 },
        expectedOutput: true
      },
      {
        input: { nums: [1,0,1,1], k: 1 },
        expectedOutput: true
      }
    ],
    difficulty: "Easy",
    tags: ["Array", "HashMap"]
  },
  {
    id: 40,
    title: "Implement Trie",
    description: "Implement a trie with insert, search, and startsWith methods.",
    starterCode: `class Trie {
  // Implement insert, search, startsWith
}`,
    testCases: [
      {
        input: { operations: ["insert", "search", "search", "startsWith", "insert", "search"], values: ["apple", "apple", "app", "app", "app", "app"] },
        expectedOutput: [null, true, false, true, null, true]
      }
    ],
    difficulty: "Medium",
    tags: ["Trie", "Data Structure"]
  },
  {
    id: 41,
    title: "Valid Palindrome II",
    description: "Check if a string can become a palindrome by deleting at most one character.",
    starterCode: `function validPalindrome(s) {
  // Write your code here
}`,
    testCases: [
      {
        input: { s: "abca" },
        expectedOutput: true
      },
      {
        input: { s: "abc" },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["String", "Two-Pointers", "Greedy"]
  },
  {
    id: 42,
    title: "Minimum Path Sum",
    description: "Find a path from top-left to bottom-right in a grid that minimizes the sum of all numbers along the path.",
    starterCode: `function minPathSum(grid) {
  // Write your code here
}`,
    testCases: [
      {
        input: { grid: [[1,3,1],[1,5,1],[4,2,1]] },
        expectedOutput: 7
      },
      {
        input: { grid: [[1,2,3],[4,5,6]] },
        expectedOutput: 12
      }
    ],
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Matrix"]
  },
  {
    id: 43,
    title: "Set Matrix Zeroes",
    description: "Set the entire row and column to 0 if an element is 0.",
    starterCode: `function setZeroes(matrix) {
  // Write your code here
}`,
    testCases: [
      {
        input: { matrix: [[1,1,1],[1,0,1],[1,1,1]] },
        expectedOutput: [[1,0,1],[0,0,0],[1,0,1]]
      },
      {
        input: { matrix: [[0,1,2,0],[3,4,5,2],[1,3,1,5]] },
        expectedOutput: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
      }
    ],
    difficulty: "Medium",
    tags: ["Array", "Matrix"]
  },
  {
    id: 44,
    title: "Rotate Image",
    description: "Rotate an n x n 2D matrix 90 degrees clockwise in-place.",
    starterCode: `function rotate(matrix) {
  // Write your code here
}`,
    testCases: [
      {
        input: { matrix: [[1,2,3],[4,5,6],[7,8,9]] },
        expectedOutput: [[7,4,1],[8,5,2],[9,6,3]]
      },
      {
        input: { matrix: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] },
        expectedOutput: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
      }
    ],
    difficulty: "Medium",
    tags: ["Array", "Matrix"]
  },
  {
    id: 45,
    title: "Reverse Words in a String",
    description: "Reverse the order of words in a string.",
    starterCode: `function reverseWords(s) {
  // Write your code here
}`,
    testCases: [
      {
        input: { s: "the sky is blue" },
        expectedOutput: "blue is sky the"
      },
      {
        input: { s: "  hello world  " },
        expectedOutput: "world hello"
      }
    ],
    difficulty: "Medium",
    tags: ["String"]
  },
  {
    id: 46,
    title: "Evaluate Reverse Polish Notation",
    description: "Evaluate an arithmetic expression in Reverse Polish Notation.",
    starterCode: `function evalRPN(tokens) {
  // Write your code here
}`,
    testCases: [
      {
        input: { tokens: ["2","1","+","3","*"] },
        expectedOutput: 9
      },
      {
        input: { tokens: ["4","13","5","/","+"] },
        expectedOutput: 6
      }
    ],
    difficulty: "Medium",
    tags: ["Array", "Stack", "Math"]
  },
  {
    id: 47,
    title: "Implement Min Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    starterCode: `class MinStack {
  // Implement push, pop, top, getMin
}`,
    testCases: [
      {
        input: { operations: ["push", "push", "push", "getMin", "pop", "top", "getMin"], values: [-2, 0, -3, null, null, null, null] },
        expectedOutput: [null, null, null, -3, null, 0, -2]
      }
    ],
    difficulty: "Medium",
    tags: ["Stack", "Data Structure"]
  },
  {
    id: 48,
    title: "Valid Mountain Array",
    description: "Return true if the array is a mountain array.",
    starterCode: `function validMountainArray(arr) {
  // Write your code here
}`,
    testCases: [
      {
        input: { arr: [0,3,2,1] },
        expectedOutput: true
      },
      {
        input: { arr: [2,1] },
        expectedOutput: false
      }
    ],
    difficulty: "Easy",
    tags: ["Array"]
  },
  {
    id: 49,
    title: "Intersection of Linked Lists",
    description: "Find the node at which the intersection of two singly linked lists begins.",
    starterCode: `function getIntersectionNode(headA, headB) {
  // Write your code here
}`,
    testCases: [
      {
        input: { listA: [4,1,8,4,5], listB: [5,0,1,8,4,5], intersectVal: 8, skipA: 1, skipB: 2 },
        expectedOutput: 8
      },
      {
        input: { listA: [2,6,4], listB: [1,5], intersectVal: 0, skipA: 3, skipB: 2 },
        expectedOutput: null
      }
    ],
    difficulty: "Easy",
    tags: ["Linked List", "Two-Pointers"]
  },
  {
    id: 50,
    title: "Number of Islands",
    description: "Count the number of islands in a 2D grid of '1's (land) and '0's (water).",
    starterCode: `function numIslands(grid) {
  // Write your code here
}`,
    testCases: [
      {
        input: { grid: [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]] },
        expectedOutput: 3
      },
      {
        input: { grid: [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]] },
        expectedOutput: 1
      }
    ],
    difficulty: "Medium",
    tags: ["Array", "Matrix", "Depth-First Search", "Breadth-First Search"]
  }
];