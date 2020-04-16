package queue

/*
src:https://blog.csdn.net/afar_ch/article/details/81153173
data:2019/9/27
*/
import (
	"sync"

	"github.com/pkg/errors"
)

type ListNode struct {
	data interface{}
	next *ListNode
}

type LinkListNode struct {
	head *ListNode
	tail *ListNode
	lock sync.Mutex
}

func NewLinkListNode() *LinkListNode {
	ret := new(LinkListNode)
	return ret
}

func (this *LinkListNode) Enque(v interface{}) {
	this.lock.Lock()
	defer this.lock.Unlock()
	node := &ListNode{v, nil}
	if this.head == nil {
		this.head = node
		this.tail = node
	} else {
		this.tail.next = node
		this.tail = node
	}
}

func (this *LinkListNode) Deque() (interface{}, error) {
	this.lock.Lock()
	defer this.lock.Unlock()
	if this.head == nil {
		return 0, errors.New("Queue Empty")
	}

	v := this.head.data
	this.head = this.head.next
	return v, nil
}
func (this *LinkListNode) IsEmpty() bool {
	this.lock.Lock()
	defer this.lock.Unlock()
	return this.head == nil
}

func (this *LinkListNode) PrevData() interface{} {
	prev := this.head
	if prev != nil {
		return prev.data
	}
	return nil
	// for prev != nil {
	// 	log.Println("node", prev.data)

	// 	prev = prev.next
	// }
}
