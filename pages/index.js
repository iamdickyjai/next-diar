import React from 'react';
import cn from 'classnames';
import toast, { Toaster } from 'react-hot-toast';
import download from 'downloadjs';

import styles from '../styles/Home.module.css';

export default function Home() {
  const [selected, setSelect] = React.useState("");
  const [result, setResult] = React.useState();
  const [isAllow, setAllow] = React.useState(false);
  const [isDone, setDone] = React.useState(false);

  // Control the appropriate toast to be showed when app selection is dis/enable
  React.useEffect(() => {
    let toastId;
    if (isAllow) {
      toastId = toast.loading("Processing...", { id: "loading" });
    } else {
      toast.dismiss(toast.loading("", { id: "loading" }));
    }
  }, [isAllow])

  // Action when diarization is completed
  React.useEffect(() => {
    if (result) {
      console.log(result);

      toast.remove();

      setDone(true);
      toast.success("Done!", { duration: 2000 })
    }
  }, [result])

  // Submit the result to corresponding application
  const submit = () => {
    if (selected == "") {
      toast.error("You need to choose a feature first!", { duration: 2000 });
    } else {
      // TODO Navigate to according page
    }
  }

  const reset = () => {
    setSelect("");
    setResult(null);
    setAllow(false);
    setDone(false);

    toast.success("Reset!", { duration: 2000 })
  }

  return (
    <div className={styles.container}>
      <Toaster />
      <FileSelection setResult={setResult} setAllow={setAllow} disabled={isAllow} />
      <AppSelection setSelect={setSelect} disabled={!isAllow} />
      {isDone &&
        <div className={styles.popupBtn}>
          <button onClick={submit}>GO</button><button onClick={reset}>Reset</button>
        </div>}
    </div>
  )
}

function FileSelection(props) {
  const [link, setLink] = React.useState("");
  const fileRef = React.createRef();
  const [isFile, setDecision] = React.useState(false);

  const setResult = props.setResult;
  const setAllow = props.setAllow;
  const disabled = props.disabled;

  // When user typed in link, remove file
  const chooseLink = (event) => {
    setLink(event.target.value)
    fileRef.current.value = null;
    setDecision(false);
  }

  // When file is submitted, remove link
  const chooseUpload = () => {
    setLink("");
    setDecision(true);
  }

  // Handler for button
  const submit = async () => {
    if (!link && !fileRef.current.value) {
      toast.error("You must choose one method!", { id: "error", duration: 2000 });
      return;
    }

    if (link) {
      if (!isValidHttpUrl(link)) {
        toast.error("That is not a valid Link!", { id: "error", duration: 2000 });
        return
      }
    }

    fetchTimeStamp();
  }

  // Send POST request to server
  // Success: Arrays of timestamp
  // Failed: Corresponding status code
  const fetchTimeStamp = async () => {
    // Disable pointer event 
    setAllow(true);

    try {
      let audio;

      if (isFile) {
        const path = fileRef.current.files;
        audio = path[0];
      } else {
        const res = await fetch(`${process.env.url}/download`, {
          method: 'POST',
          body: JSON.stringify({ "url": link }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        })

        audio = await res.blob();
      }

      const formData = new FormData();
      formData.append("file", audio);

      const response = await fetch(process.env.url, {
        method: "POST",
        body: formData,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })

      // Wait for response
      // Success: return result
      // Failed: show error and enable inputSelection again.
      const result = await response.json();
      if (response.status == 200) {
        setResult(result);
      } else {
        switch (response.status) {
          case 500:
            toast.error("Server error occured", { id: "error", duration: 2000 });
            break;
          case 403:
            toast.error("Cannot download audio from this link!", { id: "error", duration: 2000 });
            break;
          default:
            toast.error("Unknown error", { id: "error", duration: 2000 });
            break;
        }

        setAllow(false);
      }
    } catch (error) {
      toast.error("Unexpected error occurred, please try again later.", { id: 'error' });

      setAllow(false);
    }
  }

  return (
    <div className={cn(styles.inputContainer, { [styles.disabled]: disabled })}>
      <input type="text" className={styles.inputUrl} value={link} onChange={chooseLink} />
      <span>or</span>
      <input type="file" accept='audio/*' onChange={chooseUpload} ref={fileRef} />
      <button onClick={submit}>Go</button>
    </div>
  )
}

function AppSelection(props) {
  const setSelect = props.setSelect;
  const disabled = props.disabled;

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
        return <SelectBlock type={x.type} check={x.check}
          id={x.id} key={x.id} handler={selectHandler} disabled={disabled} />
      })}
    </div>
  )
}

function SelectBlock(props) {
  const type = props.type;
  const check = props.check;
  const id = props.id;
  const handler = props.handler;
  const disabled = props.disabled;

  return (
    <div
      className={cn(styles.block, { [styles.selected]: check }, { [styles.disabled]: disabled })}
      onClick={() => handler(id)}
    >
      <h1>{type}</h1>
      <p>{"TODO: "}</p>
      <li>{"諗下如果轉緊個陣refresh會點?例如refresh前話比server知唔駛再做?"}</li>
      <li>{"!!!讀useRouter, 好似好有用"}</li>
      <li>{"個block都要加個effect, 例如hover會enlarge/變色"}</li>
      <div>Go&gt;&gt;&gt;</div>
    </div>
  )
}

function isValidHttpUrl(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}