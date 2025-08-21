export const fundamentalQuestions = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    input: "nums = [2,7,11,15], target = 9",
    output: "[0,1]",
    examples: "Explanation: nums[0] + nums[1] = 2 + 7 = 9"
  },
  {
    id: 2,
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    input: "s = ['h','e','l','l','o']",
    output: "['o','l','l','e','h']",
    examples: "Example: Input: ['h','e','l','l','o'], Output: ['o','l','l','e','h']"
  },
  {
    id: 3,
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    input: "s = '()[]{}'",
    output: "true",
    examples: "Example: Input: '()[]{}', Output: true"
  },
  {
    id: 4,
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum.",
    input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
    output: "6",
    examples: "Explanation: [4,-1,2,1] has the largest sum = 6"
  },
  {
    id: 5,
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists and return it as a new sorted list.",
    input: "l1 = [1,2,4], l2 = [1,3,4]",
    output: "[1,1,2,3,4,4]",
    examples: "Explanation: After merging, the new sorted list is [1,1,2,3,4,4]"
  },
  {
    id: 6,
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. Count how many distinct ways to reach the top.",
    input: "n = 3",
    output: "3",
    examples: "Explanation: 1+1+1, 1+2, 2+1"
  },
  {
    id: 7,
    title: "Palindrome Number",
    description: "Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
    input: "x = 121",
    output: "true",
    examples: "Example: Input: 121, Output: true"
  },
  {
    id: 8,
    title: "Remove Duplicates from Sorted Array",
    description: "Given a sorted array nums, remove the duplicates in-place such that each element appears only once.",
    input: "nums = [0,0,1,1,1,2,2,3,3,4]",
    output: "5",
    examples: "After removing duplicates, first five elements are [0,1,2,3,4]"
  },
  {
    id: 9,
    title: "Best Time to Buy and Sell Stock",
    description: "Given an array prices where prices[i] is the price of a given stock on the i-th day, find the maximum profit you can achieve.",
    input: "prices = [7,1,5,3,6,4]",
    output: "5",
    examples: "Buy on day 2 (price = 1) and sell on day 5 (price = 6)"
  },
  {
    id: 10,
    title: "Intersection of Two Arrays II",
    description: "Given two arrays, write a function to compute their intersection.",
    input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]",
    output: "[4,9]",
    examples: "Output can be in any order"
  },
  {
    id: 11,
    title: "Linked List Cycle",
    description: "Given a linked list, determine if it has a cycle in it.",
    input: "head = [3,2,0,-4], pos = 1",
    output: "true",
    examples: "Explanation: There is a cycle connecting tail to node index 1"
  },
  {
    id: 12,
    title: "Symmetric Tree",
    description: "Check whether a binary tree is a mirror of itself (symmetric around its center).",
    input: "root = [1,2,2,3,4,4,3]",
    output: "true",
    examples: "Example: The tree is symmetric"
  },
  {
    id: 13,
    title: "Invert Binary Tree",
    description: "Invert a binary tree.",
    input: "root = [4,2,7,1,3,6,9]",
    output: "[4,7,2,9,6,3,1]",
    examples: "Example: After inversion, the tree is flipped"
  },
  {
    id: 14,
    title: "Maximum Depth of Binary Tree",
    description: "Given a binary tree, find its maximum depth.",
    input: "root = [3,9,20,null,null,15,7]",
    output: "3",
    examples: "Explanation: The longest path from root to leaf has length 3"
  },
  {
    id: 15,
    title: "Breadth First Search of Graph",
    description: "Perform BFS traversal of a graph starting from a given node.",
    input: "graph = {0:[1,2],1:[2],2:[0,3],3:[3]}, start = 2",
    output: "[2,0,3,1]",
    examples: "Visit nodes in BFS order"
  },
  {
    id: 16,
    title: "Depth First Search of Graph",
    description: "Perform DFS traversal of a graph starting from a given node.",
    input: "graph = {0:[1,2],1:[2],2:[0,3],3:[3]}, start = 2",
    output: "[2,0,1,3]",
    examples: "Visit nodes in DFS order"
  },
  {
    id: 17,
    title: "Valid Anagram",
    description: "Given two strings s and t, return true if t is an anagram of s.",
    input: "s = 'anagram', t = 'nagaram'",
    output: "true",
    examples: "Example: Both strings have the same character counts"
  },
  {
    id: 18,
    title: "Implement Stack using Array",
    description: "Implement a stack using arrays with push, pop, top operations.",
    input: "Operations: push(1), push(2), top(), pop(), empty()",
    output: "[2, 2, 1]",
    examples: "Push 1 and 2, top=2, pop=2, empty=1(false)"
  },
  {
    id: 19,
    title: "Implement Queue using Stack",
    description: "Implement a queue using two stacks.",
    input: "Operations: push(1), push(2), pop(), peek(), empty()",
    output: "[1,1,2]",
    examples: "Queue behaves correctly using two stacks"
  },
  {
    id: 20,
    title: "Majority Element",
    description: "Given an array of size n, find the majority element. The majority element appears more than ⌊n/2⌋ times.",
    input: "nums = [3,2,3]",
    output: "3",
    examples: "3 appears twice which is more than n/2"
  },
  {
    id: 21,
    title: "Remove Element",
    description: "Remove all instances of a value in-place and return the new length.",
    input: "nums = [3,2,2,3], val = 3",
    output: "2",
    examples: "After removal, nums = [2,2]"
  },
  {
    id: 22,
    title: "Implement Linked List",
    description: "Implement a singly linked list with insert, delete, and search operations.",
    input: "Operations: insert(1), insert(2), delete(1), search(2)",
    output: "[2]",
    examples: "Linked list works correctly"
  },
  {
    id: 23,
    title: "Rotate Array",
    description: "Rotate an array of n elements to the right by k steps.",
    input: "nums = [1,2,3,4,5,6,7], k = 3",
    output: "[5,6,7,1,2,3,4]",
    examples: "Explanation: Rotate 3 steps to the right"
  },
  {
    id: 24,
    title: "Contains Duplicate",
    description: "Check if the array contains any duplicates.",
    input: "nums = [1,2,3,1]",
    output: "true",
    examples: "1 appears twice"
  },
  {
    id: 25,
    title: "Single Number",
    description: "Given a non-empty array of integers, every element appears twice except for one. Find that single one.",
    input: "nums = [4,1,2,1,2]",
    output: "4",
    examples: "4 is the element that appears once"
  },
  {
    id: 26,
    title: "Pascal's Triangle",
    description: "Generate the first numRows of Pascal's triangle.",
    input: "numRows = 5",
    output: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
    examples: "Each row is sum of elements above"
  },
  {
    id: 27,
    title: "Valid Sudoku",
    description: "Determine if a 9x9 Sudoku board is valid.",
    input: "board = [['5','3','.','.','7','.','.','.','.'],...]",
    output: "true",
    examples: "Board follows Sudoku rules"
  },
  {
    id: 28,
    title: "Minimum Depth of Binary Tree",
    description: "Find the minimum depth from root to nearest leaf node.",
    input: "root = [3,9,20,null,null,15,7]",
    output: "2",
    examples: "Shortest path from root to leaf is length 2"
  },
  {
    id: 29,
    title: "Symmetric Difference of Arrays",
    description: "Return elements in one array but not the other.",
    input: "nums1 = [1,2,2,3], nums2 = [2,3,4]",
    output: "[1,4]",
    examples: "Elements only in one array"
  },
  {
    id: 30,
    title: "Plus One",
    description: "Given a non-empty array representing a non-negative integer, increment the integer by one.",
    input: "digits = [1,2,3]",
    output: "[1,2,4]",
    examples: "123 + 1 = 124"
  },
  {
    id: 31,
    title: "Move Zeroes",
    description: "Move all 0's to the end while maintaining relative order of non-zero elements.",
    input: "nums = [0,1,0,3,12]",
    output: "[1,3,12,0,0]",
    examples: "Move all zeros to the end"
  },
  {
    id: 32,
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    input: "head = [1,2,3,4,5]",
    output: "[5,4,3,2,1]",
    examples: "Linked list reversed"
  },
  {
    id: 33,
    title: "Remove Linked List Elements",
    description: "Remove all elements from a linked list of integers that have value val.",
    input: "head = [1,2,6,3,4,5,6], val = 6",
    output: "[1,2,3,4,5]",
    examples: "All 6's removed"
  },
  {
    id: 34,
    title: "Symmetric Binary Tree",
    description: "Check if a binary tree is symmetric.",
    input: "root = [1,2,2,3,4,4,3]",
    output: "true",
    examples: "Tree is mirror of itself"
  },
  {
    id: 35,
    title: "Balanced Binary Tree",
    description: "Determine if a binary tree is height-balanced.",
    input: "root = [3,9,20,null,null,15,7]",
    output: "true",
    examples: "Left and right subtree heights differ by at most 1"
  },
  {
    id: 36,
    title: "Diameter of Binary Tree",
    description: "Find the diameter of a binary tree.",
    input: "root = [1,2,3,4,5]",
    output: "3",
    examples: "Longest path between any two nodes"
  },
  {
    id: 37,
    title: "Maximum Product Subarray",
    description: "Find the contiguous subarray within an array which has the largest product.",
    input: "nums = [2,3,-2,4]",
    output: "6",
    examples: "Subarray [2,3] gives max product 6"
  },
  {
    id: 38,
    title: "Best Time to Buy and Sell Stock II",
    description: "You can buy and sell stock multiple times. Find the max profit.",
    input: "prices = [7,1,5,3,6,4]",
    output: "7",
    examples: "Buy on day 2, sell on day 3, buy day 4, sell day 5"
  },
  {
    id: 39,
    title: "Contains Duplicate II",
    description: "Check if array contains duplicates within k distance.",
    input: "nums = [1,2,3,1], k = 3",
    output: "true",
    examples: "1 appears twice within 3 indices"
  },
  {
    id: 40,
    title: "Implement Trie",
    description: "Implement a trie with insert, search, and startsWith methods.",
    input: "Operations: insert('apple'), search('apple'), startsWith('app')",
    output: "[true,true]",
    examples: "Trie operations return correct results"
  },
  {
    id: 41,
    title: "Valid Palindrome II",
    description: "Given a string s, you may delete at most one character to make it a palindrome.",
    input: "s = 'abca'",
    output: "true",
    examples: "Delete 'c' → 'aba' is palindrome"
  },
  {
    id: 42,
    title: "Minimum Path Sum",
    description: "Given a m x n grid filled with non-negative numbers, find a path from top-left to bottom-right which minimizes sum.",
    input: "grid = [[1,3,1],[1,5,1],[4,2,1]]",
    output: "7",
    examples: "Path 1→3→1→1→1→1 gives minimum sum"
  },
  {
    id: 43,
    title: "Set Matrix Zeroes",
    description: "If an element is 0, set its entire row and column to 0.",
    input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
    output: "[[1,0,1],[0,0,0],[1,0,1]]",
    examples: "Zero rows and columns correctly updated"
  },
  {
    id: 44,
    title: "Rotate Image",
    description: "Rotate an n x n 2D matrix 90 degrees clockwise in-place.",
    input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
    output: "[[7,4,1],[8,5,2],[9,6,3]]",
    examples: "Matrix rotated correctly"
  },
  {
    id: 45,
    title: "Reverse Words in a String",
    description: "Reverse the order of words in a string.",
    input: "s = 'the sky is blue'",
    output: "'blue is sky the'",
    examples: "Words reversed"
  },
  {
    id: 46,
    title: "Evaluate Reverse Polish Notation",
    description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation.",
    input: "tokens = ['2','1','+','3','*']",
    output: "9",
    examples: "((2+1)*3) = 9"
  },
  {
    id: 47,
    title: "Implement Min Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    input: "Operations: push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
    output: "[-3,-2,0]",
    examples: "Minimum element tracked correctly"
  },
  {
    id: 48,
    title: "Valid Mountain Array",
    description: "Return true if the array is a mountain array.",
    input: "arr = [0,3,2,1]",
    output: "true",
    examples: "Array increases then decreases"
  },
  {
    id: 49,
    title: "Intersection of Linked Lists",
    description: "Find the node at which the intersection of two singly linked lists begins.",
    input: "ListA = [4,1,8,4,5], ListB = [5,0,1,8,4,5]",
    output: "8",
    examples: "Intersection node value is 8"
  },
  {
    id: 50,
    title: "Number of Islands",
    description: "Given a 2D grid map of '1's (land) and '0's (water), count the number of islands.",
    input: "grid = [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']]",
    output: "3",
    examples: "There are 3 islands in the grid"
  }
];
