# useTransition

- dùng cho cập nhật **state**
- khi call api mà load nó lâu muốn thực hiện thao tác khác mà UI bị đơ (block) thì dùng useTransition (kiểu code trong startTransition có mức độ ưu tiên chạy thấp hơn)
- const [isPending, startTransition] = useTransition();
- có thể import startTransition mà không cần dùng useTransition()
- mục đích sử dụng để cập nhật state có trạng thái ưu tiên thấp
- trả về giá trị trạng thái cho trạng thái đang chờ của 1 sự chuyển tiếp và hàm để bắt đầu nó
- áp dụng với <Suspense> để tạo hiệu ứng **loading**
- dùng thư viện skeleton để tạo loading
- dùng useEffect để Render Spinner cũng được
- [tham khảo](https://beta.reactjs.org/reference/react/Suspense)
- [tham khảo](https://beta.reactjs.org/reference/react/Suspense)

# useState

- khi muốn dữ liệu thay đổi thì giao diện tự cập nhật (render lại theo dữ liệu)
- render dựa trên sự thay đổi state
- **state** như 1 bộ nhớ của Component
- dạng thứ 2 của setState() là nhận vào 1 function thay vì object
- dạng thứ 2 này giải quyết vấn đề bất đồng bộ
- muốn truyền xuống children component cứ chuyền state, setState như props
- setState((state, props)=>{
  // code
  return state + 1;
  })
- trong đó:
  - state là state trước đó hàm được nhận
  - props: là khi props được cập nhật
- khi setState thì React merge cái state object truyền vào với cái state object cũ
- nghĩa là nếu state là 1 value thì nó override value cũ, nếu là 1 object thì React chỉ merge phần thay đổi
- state mới sẽ được so sánh với state cũ, có thay đổi không nếu có mới render
- setState trigger re-render chứ không cập nhật DOM ngay
- có 1 cách để cập nhật ngay
- This will instruct React to update the DOM synchronously right after the code wrapped in flushSync executes. As a result, the last todo will already be in the DOM by the time you try to scroll to it

```js - flushSync
flushSync(() => {
  setText("");
  setTodos([...todos, newTodo]);
});
```

- ví dụ:

```js
constructor(props) {
  super(props);
  this.state = {
    posts: [],
    comments: []
  };
}

componentDidMount() {
  fetchPosts().then(response => {
    this.setState({
      posts: response.posts
    });
  });

  fetchComments().then(response => {
    this.setState({
      comments: response.comments
    });
  });
}
```

<br>
cách dùng:
<br>

```js
import React, { useState } from "react";

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  // viết tên state đúng quy ước
  return (
    <div>
      <p>You clicked {count} times</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
  // mỗi lần gọi setcount, React sẽ re-render Example component, truyền vào new count
  // so sánh giá trị set có khác với giá trị trước đó không
  // re-render bằng cách gọi lại function component
  //Lưu ý: setState() nhận vào đối số là state trước đó
  /*setState((test)=>{
    console.log(test);
    return test + 1;
  })
  */
}
```

# Lưu ý

- Component được render lại khi setState
- Initial state chỉ dùng cho lần đầu
- set state dạng 2 với call back: thử gọi hàm setState với đối số truyền vào là callback
- initial với callback
- setState là thay thế state bằng giá trị mới
- có 1 thư viện hỗ trợ quản lý **state** phức tạp trong React là dùng **Redux**
- đối với state là 1 **object** hoặc **array** nếu setState chỉ có thể sửa đổi state cũ, không truyền object hoặc array mới vào
- In React, state is considered read-only, so you should replace it rather than mutate your existing objects.

# Lifting state up

- kỹ thuật đưa state lên ancestor gần nhất cần nó
- truyền xuống children chỉ cần truyền state, setState như props

# 2 way binding

- dữ liệu trên giao diện thay đổi thì dữ liệu trong xử lý cũng thay đổi theo gọi là 1 way binding
- dữ liệu trên xử lý thay đổi thì dữ liệu trên giao diện cũng thay đổi theo gọi là 1 way binding
- có cả 2 gọi là 2 way binding

# Mounted - Unmounted

- Mount chỉ thời điểm đưa component vào sử dụng
- Unmount chỉ thời điểm gỡ component ra
- Sử dụng useState để Mount hoặc Unmount

# LifeCycle trong React

- didMount
- WillUnmount

# useRef

- const refContainer = useRef(initialValue);
- trả về 1 object { current: "init value" }
- During the render, the DOM nodes have not yet been created, so ref.current will be null.
- Mỗi lần **function component** re-render sẽ tạo ra phạm vi khác điều đó có nghĩa 1 biến thông thường như `var, let` sẽ có những phạm vi truy cập khác nhau, tuy nhiên vì nhu cầu nên useRef sinh ra để giúp giữ tham chiếu này tồn tại trong cả vòng đời của **component**
- nếu không sử dụng **useRef** thì có thể đưa biến ra phạm vi bên ngoài **function component** nhưng đó không phải cách viết code **React**
- 1 ví dụ cơ bản là **giúp focus trong ô input**
- ngoài ra còn tham chiếu đến DOM node (DOM thật), đối với Function Component thì không được
- theo mặc định React không để Component truy cập vào DOM Nodes của component khác, ví dụ khai báo useRef ở Component cha rồi truyền xuống cho Component con <MyInput ref={inputRef} />
  trong MyInput đó có <input ref={inputRef} />, điều này cho phép Component cha thao tác với DOM bên trong Component con thoải mái, để hạn chế dùng **useImperativeHandle**

# useReducer

- lưu giữ state giống useState
- hỗ trợ các logic state phức tạp hơn useState
- useReducer(reducer, initialArg, init)
  - reducer: hàm xử lý logic
  - initialArg: giá trị khởi tạo
  - init: The initial state will be set to init(initialArg).

# useMemo

- trả về 1 giá trị được nhớ, dùng cho việc tính toán
- dĩ nhiên render lần đầu cũng gọi callback
- useMemo(hàm trả về giá trị, [deps])
- nếu deps thay đổi thì nó sẽ tính toán lại, nếu không truyền deps hoặc để giá trị cố định thì nó chỉ thực hiện callback 1 lần.

```js - example
import { useMemo, useState } from "react";

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(
    () => getFilteredTodos(todos, filter),
    [todos, filter]
  );
  // ...
}
```

- This tells React that you don’t want the inner function to re-run unless either todos or filter have changed. React will remember the return value of getFilteredTodos() during the initial render. During the next renders, it will check if todos or filter are different. If they’re the same as last time, useMemo will return the last result it has stored. But if they are different, React will call the inner function again (and store its result).
- The function you wrap in useMemo runs during rendering, so this only works for pure calculations.

# useImperativeHandle

- component cha có thể sử dụng ref object của component con, sử dụng useImperativeHandle để giới hạn những gì mà component cha sử dụng được ref object của component con
- mục đích đảm bảo tính đóng gói.
- function component không có ref, sử dụng **forwardRef** để truyền ref
- hàm nào được wrap **forwardRef** thì sẽ nhận ref là tham số thứ 2 truyền vào, ref đó chính là ref ở ngoài truyền vào

# Side effect

- **side effect**: khi có tác động xảy ra dẫn đến dữ liệu bị thay đổi
- These changes—updating the screen, starting an animation, changing the data—are called **side effects**. They’re things that happen “**on the side**”, **not during rendering**.
- In React, **side effects** usually belong inside event handlers.

# useEffect

- chỉ sử dụng **useEffect** như giải pháp cuối cùng, đưa logic vào JSX nếu có thể
- **component** cần được làm gì đó sau khi render
- Unlike events, Effects are caused by rendering itself rather than a particular interaction. (không có tương tác, tự động chạy theo cú pháp)
- You do need Effects to synchronize with external systems (browser API, calling API, using library such as jQuery or DOM manupulation).

# Cú pháp

- `useEffect(callback)`
  - callback được gọi mỗi khi **Component render**, ngay cả lần đầu render
  - your Effect will **run after every render**.
  - This runs **after** every render
- `useEffect(callback, [])`
  - chỉ được gọi 1 lần sau khi Component mounted
  - This runs only on mount (when the component appears on the screen for the first time.)
  - Now your Effect’s code does not use any reactive values, so its dependencies can be empty ([]).
- `useEffect(callback, [deps])`: **deps** là các biến mang giá trị
  - callback được gọi lại mỗi khi **deps** thay đổi
  - This runs on mount _and also_ if either a or b have changed since the last render
  - Every reactive value used by your Effect’s code must be declared in your dependency list.
  - React will only skip re-running the Effect if all of the dependencies you specify have exactly **the same values** as they had during **the previous render**. React compares the dependency values using the Object.is comparison.
- cả 3 đều có callback, và callback luôn được gọi mỗi khi **Component render**

# Chú ý

- parent Component re-render thì cũng re-render các child Component trong nó
- **Each render has its own Effects**

# useEffect with DOM Event

- callback của useEffect có thể return 1 hàm, hàm đó có công dụng **Cleanup**
- hàm **cleanup** được chạy khi **clean it up in componentWillUnmount**

# useEffect with timer function

- hàm **cleanup** luôn được gọi trước khi callback được gọi (trừ lần mounted, lần mount đầu tiên)
- nghĩa là dọn dẹp callback trước đó
- After your **component is removed from the DOM**, React **will run your cleanup function**.

# example

- The problem is that the code inside of your Effect depends on the isPlaying prop to decide what to do, but this dependency was not explicitly declared. To fix this issue, add isPlaying to the dependency array:

```js
useEffect(() => {
  let active = true;
  if (isPlaying) {
    // It's used here...
    if (active) {
      // ...
    }
    // ...
  } else {
    // ...
  }
  return () => {
    // Each render’s Effect has its own *active* variable.
    active = false;
  };
}, [isPlaying]); // ...so it must be declared here!
```

# Fetching data

- If you don’t use a framework (and don’t want to build your own) but would like to make data fetching from Effects more ergonomic, consider extracting your fetching logic into a custom Hook like in this example:

```js
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

# useId

- mục đích generate thuộc tính id cho DOM Element
- ví dụ:

```js
const Form = ()=>{
  <label htmlFor="my-id">Name:</label>
  <input id="my-id" type="text" />
}
```

- id bị hardcode, nếu tái sử dụng component Form dẫn đến bị trùng id

```js
<Form />
<Form />
```

- bấm vào label nào cũng chỉ focus vào input phía trên
- `const id = useId()` tạo ra id duy nhất
- cách dùng
  - tạo id duy nhất
  - chỉ định prefix dùng chung cho tất cả id

```js
export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + "-firstName"}>Name:</label>
      <input id={id + "-firstName"} type="text" />
      <hr />
      <label htmlFor={id + "-lastName"}>Name:</label>
      <input id={id + "-lastName"} type="text" />
    </form>
  );
}
```

# useContext

- Mục đích: truyền dữ liệu vào các component con, component khác mà không truyền bằng props phức tạp qua các component trung gian.
- `React.createContext(defaultValue);`
- **defaultValue** sẽ được sử dụng nếu chưa được Provider (trong prop **value**)
- `<MyContext.Provider value={/* some value */}>`
- Consumer sẽ dùng Provider cha gần nhất
- nhận context: `useContext(context)`
  - context: context được tạo ra từ **createContext**

# useDeferredValue

- cách dùng khác giống thuật ngữ **debounce**
- mục đích chung nhất là giúp **trì hoãn** lại 1 phần UI
  - hiển thị content cũ khi content mới đang loading, ví dụ: show kết quả tìm kiếm cũ (có thể thêm hiệu ứng làm mờ) khi kết quả tìm kiếm mới đang loading
  - cho biết content đã cũ
  - Hoãn cập nhật 1 phần giao diện

# Return

- render lần đầu thì deferredValue giống với value truyền vào
- ví dụ:

```jsx
import SearchResult from './SearchResult';

export default function App(
  const [query, setQuery] = useState('');
  const defferedQuery = useDeferredValue(query);
  // nếu log thì deferredValue sẽ cập nhật lại chậm hơn so với query
  const isStale = query !== defaultValue
  return (
    <label>
      Search Input:
      <input value={query} onChange={e=>{setQuery(e.target.value)}} />
    </label>
    <Suspense fallback={<h2>Loading...</h2>}>
      <div style={{
        opacity: isStale ? 0.5 : 1,
        transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0 0 linear'
      }}>
        <SearchResult query={defferedQuery} />
      </div>
    </Suspense>
  )
)
```

# useCallBack

- nếu một hàm được khai báo trong 1 component thì mỗi khi component render (re-render) thì hàm đó sẽ được **tạo mới** (địa chỉ vùng nhớ mới)

# syntax

- useCallback(fn, deps)
- tương đương với useMemo(() => fn, deps).
- **deps** là mảng rỗng hoặc mảng chứa các dependencies.
- truyền vào hàm và trả về hàm đã được ghi nhớ, mỗi lần re-render Component cha mà không cần re-render lại component con không cần thiết. Lý do, re-render tạo vùng nhớ mới dẫn đến thay đổi tham chiếu của hàm, nên hàm đó cần nhớ lại và chỉ thay đổi tham chiếu khi cần thiết.
- dependencies thay đổi thì tham chiếu sẽ thay đổi.
