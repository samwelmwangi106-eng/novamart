class Node:
    def __init__(self, data):
        self.data = data
        self.next = None  # For singly linked list

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def delete_node(self, key):
        # If the head node itself holds the key
        if self.head and self.head.data == key:
            self.head = self.head.next
            return

        # Search for the key and keep track of the previous node
        current = self.head
        prev = None
        while current and current.data != key:
            prev = current
            current = current.next

        # If the key was not found
        if not current:
            return

        # Unlink the node from the linked list
        prev.next = current.next

    def display(self):
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")

# Usage Example
playlist = LinkedList()
playlist.insert_at_front("Song A")
playlist.insert_at_front("Song B")
playlist.insert_at_front("Song C")

playlist.display()
# Expected: Song C -> Song B -> Song A -> None

playlist.delete_node("Song B")
playlist.display()
# Expected: Song C -> Song A -> None
