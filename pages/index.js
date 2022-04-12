import React from 'react';
import cn from 'classnames';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import styles from '../styles/Home.module.css';
import { DataContext } from '../components/reducer';


export default function Home() {
  const [state, dispatch] = React.useContext(DataContext);
  const [isAllow, setAllow] = React.useState(false);
  const [isDone, setDone] = React.useState(false);

  const router = useRouter();

  // Control the appropriate toast to be showed when app selection is dis/enable
  React.useEffect(() => {
    let toastId;
    if (isAllow) {
      toastId = toast.loading("Processing, Please wait...", { id: "loading" });
    } else {
      toast.dismiss(toast.loading("", { id: "loading" }));
    }
  }, [isAllow])

  // Action when diarization is completed
  React.useEffect(() => {
    if (isDone) {
      toast.remove();
      toast.success("Done!", { duration: 2000 })
    }
  }, [isDone])

  // Submit the result to corresponding application
  const submit = () => {
    if (!state.application) {
      toast.error("You need to choose a feature first!", { duration: 2000 });
      return;
    }

    // !Should not happen
    if (!state.file) {
      toast.error("Cannot detect your file. Please try again.", { duration: 2000 });
      return;
    }

    // !Should not happen
    if (!state.timestamp) {
      toast.error("Diarization is corrupted. Please try again.", { duration: 2000 });
      return;
    }

    router.push('/application');
  }

  const reset = () => {
    setAllow(false);
    setDone(false);
    dispatch({ type: 'CLEAR' });

    toast.success("Reset!", { duration: 2000 })
  }

  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.instruction}>
        <div>This application help you to find out "Who Spoke When"</div>
        <div>To begin, submit a file or a YouTube link</div>
      </div>
      <FileSelection setAllow={setAllow} setDone={setDone} disabled={isAllow} />
      <AppSelection disabled={!isAllow} />
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
  const [state, dispatch] = React.useContext(DataContext);

  const setDone = props.setDone;
  const setAllow = props.setAllow;
  const disabled = props.disabled;

  React.useEffect(() => {
    if (state.file && state.timestamp) {
      setAllow(true);
      setDone(true);
    }
  }, [])

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
        return;
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
        dispatch({ type: "UPDATE_DIAR", timestamp: result['result'], file: audio, link: link });
        setDone(true);
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
  const disabled = props.disabled;
  const [state, dispatch] = React.useContext(DataContext);
  const [blockArr, setBlock] = React.useState([
    {
      type: "extract", id: 0, check: false,
      description: [["Automated audio extraction",],
      ["Download files", <FontAwesomeIcon icon={faCheck} key={"e_2"} />]],
    },
    {
      type: "label", id: 1, check: false,
      description: [["Audio labelling",],
      ["Subtitling", <FontAwesomeIcon icon={faCheck} key={"l_2"} />],
      ["Script Generation", <FontAwesomeIcon icon={faCheck} key={"l_3"} />],
      ["Commenting", <FontAwesomeIcon icon={faCheck} key={"l_3"} />],]
    },
    // {
    //   type: "processing", id: 2, check: false,
    //   description: ["..."]
    // },
  ]);

  React.useEffect(() => {
    if (state.application) {
      selectHandler(blockArr.find(ele => ele.type == state.application).id)
    }
  }, [])

  React.useEffect(() => {
    if (disabled) {
      const newArr = [...blockArr];
      newArr.forEach(ele => ele.check = false);

      setBlock(newArr);
    } else {
      const newArr = [...blockArr];
      newArr.forEach(ele => (ele.type === state.application) && (ele.check = true));

      setBlock(newArr);
    }
  }, [disabled])

  const selectHandler = (id) => {
    // Get the unselected option, and set them to false
    const arrWithoutTheSelected = blockArr.filter(x => x.id !== id);
    arrWithoutTheSelected.forEach(ele => ele.check = false);

    // Get the selected option, then select/unselect it
    const arrWithTheID = blockArr.filter(x => x.id === id);
    arrWithTheID.forEach(ele => {
      ele.check = !ele.check;
    });

    // Concat two arrays into one again, then sort them according to id, so the order will not change
    const combinedArr = arrWithoutTheSelected.concat(arrWithTheID);
    const sortedArr = combinedArr.sort((x, y) => x.id - y.id);

    setBlock(sortedArr);
  }

  return (
    <div className={styles.selectionArea}>
      {blockArr.map(x => {
        return <SelectBlock type={x.type} description={x.description} check={x.check}
          id={x.id} key={x.id} handler={selectHandler} disabled={disabled} />
      })}
    </div>
  )
}

function SelectBlock(props) {
  const type = props.type;
  const description = props.description;
  const check = props.check;
  const id = props.id;
  const handler = props.handler;
  const disabled = props.disabled;

  const [state, dispatch] = React.useContext(DataContext);

  const Click = () => {
    dispatch({ type: "UPDATE_SELECTION", application: type });
    handler(id);
  }

  return (
    <div
      className={cn(styles.block, { [styles.selected]: check }, { [styles.disabled]: disabled })}
      onClick={() => Click()}
    >
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      {description.map((ele, index) => <li className={styles.appDescription} key={index}>{ele[0]} {ele[1]}</li>)}
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