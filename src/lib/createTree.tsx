import { useMemo } from 'react'

// Generic type definition
export type TreeNode<T> = T & { [key: string]: TreeNode<T>[] }

/**
 * Constructs multiple tree Structures given a flattened input. Filters out all root nodes
 * based on its parentId and recursively builds the trees out based on some recursion key.
 * Ensure the items passed have defined both an Id and a parentId otherwise this will not be possible.
 * @param items Flattened array of objects we want to convert to tree(s).
 * @param key Some key of type ITEMS, acts as recursion key.
 * @returns Array of Trees
 */
export const createTree = <T extends { id: string; parentId: string | null }>(
  items: T[],
  key: keyof T,
): TreeNode<T>[] => {
  if (!items) return []
  // Generic recursive function to build the tree
  const buildTree = (item: T): TreeNode<T> => {
    return {
      ...item,
      [key]: items.filter((child) => child.parentId === item.id).map(buildTree),
    } as TreeNode<T>
  }
  // Get root nodes and build the tree structure
  const rootNodes = items.filter((item) => !item.parentId) || []
  return rootNodes.map(buildTree) // Build the tree for each root node
}

/**
 * Constructs multiple tree Structures given a flattened input. Filters out all root nodes
 * based on its parentId and recursively builds the trees out based on some recursion key.
 * Ensure the items passed have defined both an Id and a parentId otherwise this will not be possible.
 * @param items Flattened array of objects we want to convert to tree(s).
 * @param key Some key of type ITEMS, acts as recursion key.
 * @returns Array of Trees
 */
export const createMemoizedTree = <
  T extends { id: string; parentId: string | null },
>(
  items: T[],
  key: keyof T,
): TreeNode<T>[] => {
  return useMemo(() => {
    if (!items) return []
    // Generic recursive function to build the tree
    const buildTree = (item: T): TreeNode<T> => {
      return {
        ...item,
        [key]: items
          .filter((child) => child.parentId === item.id)
          .map(buildTree),
      } as TreeNode<T>
    }
    // Get root nodes and build the tree structure
    const rootNodes = items.filter((item) => !item.parentId) || []
    return rootNodes.map(buildTree) // Build the tree for each root node
  }, [items, key])
}

/**
 * Flattens a given tree and returns all TreeNodes without children
 * @param tree A TreeNode from which we start flattening
 * @param childrenKey Key from which we can retrieve children
 * @returns Array of flattened TreeNodes
 */
export function flattenTree<T>(
  tree: TreeNode<T>[],
  childrenKey: keyof TreeNode<T>,
): TreeNode<T>[] {
  const result: TreeNode<T>[] = []
  const stack: TreeNode<T>[] = [...tree]

  while (stack.length > 0) {
    const node = stack.pop()
    const { [childrenKey]: children, ...rest } = node

    // Add the node without the children property
    result.push(rest as TreeNode<T>)
    if (Array.isArray(children)) {
      stack.push(...children)
    }
  }

  return result
}

/**
 * Implementation of simple Breadth-First-Search for a given TreeNode. Uses a queue to
 * handle higher level children first.
 * @param tree Some TreeNode to start the search from
 * @param childrenKey Key from which we can retrieve children
 * @returns A flattened array of TreeNodes including all children
 */
export function BFSSearch<T>(
  tree: TreeNode<T>[],
  childrenKey: keyof TreeNode<T>,
): TreeNode<T>[] {
  const result: TreeNode<T>[] = []
  const queue: TreeNode<T>[] = [...tree]

  while (queue.length > 0) {
    const node = queue.shift()
    const { [childrenKey]: children, ...rest } = node
    result.push(rest as TreeNode<T>)
    if (Array.isArray(children)) {
      queue.push(...children)
    }
  }

  return result
}
