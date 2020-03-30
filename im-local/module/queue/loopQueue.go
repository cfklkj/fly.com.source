package queue

/*
src:https://blog.csdn.net/afar_ch/article/details/81153173
data:2019/9/27
*/
import (
	"sync"

	"github.com/pkg/errors"
)

/*
循环队列   2019/12/10
*/
type LoopListNode struct {
	head *ListNode
	tail *ListNode
	R    *ListNode //读指针
	lock sync.Mutex
}

func NewLoopListNode() *LoopListNode {
	ret := new(LoopListNode)
	return ret
}

func (this *LoopListNode) Enque(v interface{}) {
	this.lock.Lock()
	defer this.lock.Unlock()
	node := &ListNode{v, nil}
	if this.R == nil {
		this.head = node
		this.tail = node
		this.head.next = this.tail
		this.tail.next = this.head
		this.R = this.tail
	} else {
		this.tail.next = node
		this.tail = node
		this.tail.next = this.head
	}
}
func (this *LoopListNode) Deque() (interface{}, error) {
	this.lock.Lock()
	defer this.lock.Unlock()
	if this.R == nil {
		return 0, errors.New("Queue Empty")
	}
	v := this.head.data
	if this.head == this.tail {
		this.R = nil
		return nil, nil
	}
	if this.head == this.R {
		this.R = this.R.next
	}
	this.head = this.head.next
	this.tail.next = this.head
	return v, nil
}
func (this *LoopListNode) IsEmpty() bool {
	this.lock.Lock()
	defer this.lock.Unlock()
	return this.R == nil
}

func (this *LoopListNode) ReadData() (res interface{}) {
	this.lock.Lock()
	defer this.lock.Unlock()
	if this.R != nil {
		this.R = this.R.next
		return this.R.data
	}
	return nil
}

func (this *LoopListNode) DequeValue(v interface{}) bool {
	this.lock.Lock()
	defer this.lock.Unlock()
	if this.R == nil {
		return false
	}
	//头=尾
	if this.head == this.tail {
		if this.head.data != v {
			return false
		}
		this.R = nil
		this.head = nil
		this.tail = nil
		return true
	}
	//头
	head := this.head
	if head.data == v {
		this.head = this.head.next
		this.tail.next = this.head
		this.R = this.tail
		return true
	}
	//尾
	remove := this.head
	moveHead := remove
	for {
		if remove.data == v {
			moveHead.next = remove.next
			this.R = moveHead
			return true
		}
		moveHead = remove
		remove = remove.next
		if remove == this.head {
			return false
		}
	}
}

func (this *LoopListNode) Length() int {
	this.lock.Lock()
	defer this.lock.Unlock()
	if this.R == nil {
		return 0
	}
	temp := this.head
	i := 1
	for ; temp != nil && this.head != temp.next; i++ {
		temp = temp.next
	}
	return i

}
