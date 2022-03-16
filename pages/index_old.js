import React from 'react';
import cn from 'classnames';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [selected, setSelect] = React.useState("");
  const [test, setTest] = React.useState("");

  React.useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/hello`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const json = await res.json();
      setTest(json?.name);
      console.log(`test value: ${json}`);
    }

    fetcher();
  }, [])

  const sendRequest = async () => {
    const fetcher = async () => {
      const res = await fetch(`/api/test`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const json = await res.json();
      console.log(`test value: ${json}`);
    }

    fetcher();


    if (selected !== null && selected !== '') {
      alert(`GO to ${selected}`);
    } else {
      alert("Damn you dick ass");
    }
  }

  return (
    <div className={styles.container}>
      <p>{test}</p>
      <input type="text" />
      <button onClick={sendRequest}>Go</button>
      <p>or Upload</p>
      <AppSelection setSelect={setSelect} />
    </div>
  )
}

function AppSelection(props) {
  const setSelect = props.setSelect;

  const [blockArr, setBlock] = React.useState([
    { type: "extract", id: 0, check: false },
    { type: "translate", id: 1, check: false },
    { type: "conference", id: 2, check: false }
  ]);

  const selectHandler = (id) => {
    // Get the unselected option, and set them to false
    const arrWithoutTheSelected = blockArr.filter(x => x.id !== id);
    arrWithoutTheSelected.forEach(ele => ele.check = false);

    // Get the selected option, then select/unselect it
    const arrWithTheID = blockArr.filter(x => x.id === id);
    arrWithTheID.forEach(ele => {
      ele.check = !ele.check;
      ele.check ? setSelect(ele.type) : setSelect("");
    });

    // Concat two arrays into one again, then sort them according to id, so the order will not change
    const combinedArr = arrWithoutTheSelected.concat(arrWithTheID);
    const sortedArr = combinedArr.sort((x, y) => x.id - y.id);

    setBlock(sortedArr);
  }

  return (
    <div className={styles.selectionArea}>
      {blockArr.map(x => {
        return <SelectBlock type={x.type} check={x.check} id={x.id} key={x.id} handler={selectHandler} />
      })}
    </div>
  )
}

function SelectBlock(props) {
  const type = props.type;
  const check = props.check;
  const id = props.id;
  const handler = props.handler;

  return (
    <div
      className={cn(styles.block, { [styles.selected]: check })}
      onClick={() => handler(id)}
    >
      <h1>{type}</h1>
      <p>{"TODO: "}</p>
      <li>{"!!!讀useRouter, 好似好有用"}</li>
      <li>{"將GO>>> Animated"}</li>
      <li>{"Link變做包住成個block"}</li>
      <li>{"hover個block個陣就Go>>> highlight 加slide去加邊，剩番Go"}</li>
      <li>{"個block都要加個effect, 例如hover會enlarge/變色"}</li>
      <div>Go&gt;&gt;&gt;</div>
    </div>
  )
}