import { useMemo } from 'react'

// Generic type definition
type TreeNode<T> = T & { [key: string]: TreeNode<T>[] }

/**
 * Constructs multiple tree Structures given a flattened input. Filters out all root nodes
 * based on its parentId and recursively builds the trees out based on some recursion key.
 * Ensure the items passed have defined both an Id and a parentId otherwise this will not be possible.
 * @param items Flattened array of objects we want to convert to tree(s).
 * @param key Some key of type ITEMS, acts as recursion key.
 * @returns Array of Trees
 */
export const useTree = <T extends { id: string; parentId: string | null }>(
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
