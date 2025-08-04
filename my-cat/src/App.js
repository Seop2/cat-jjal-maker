import logo from "./logo.svg";
import React from "react";
import Title from "./Title";
import "./App.css";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const endpoint = `/cat/says/${text}?json=true`;

  try {
    const response = await fetch(`${OPEN_API_DOMAIN}${endpoint}`);

    if (!response.ok) {
      throw new Error(`😿 서버 응답 실패: ${response.status}`);
    }
    return `${OPEN_API_DOMAIN}/cat/says/${text}`;
  } catch (error) {
    console.error("🐱 fetchCat 에러:", error.message);
    alert("고양이 이미지를 불러오지 못했습니다. 다시 시도해 주세요.");
    return null;
  }
};

/**
 * Form
 * */
const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (value == "") {
      setErrorMessage("빈 값으로 만들 수 없음");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};
function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}
function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장..</div>;
  }
  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";
  // useState는 함수형 컴포넌트에서 상태(state)를 관리할 수 있도록 도와주는 훅

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainCat, setMainCat] = React.useState(CAT1);

  // const [favorites, setFavorites] = React.useState(
  //   jsonLocalStorage.getItem("favorites") || []
  // );
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });
  const alreadyFavorite = favorites.includes(mainCat);

  async function setInitCat() {
    const firstCat = await fetchCat("First cat");
    console.log("firstCat log");
    setMainCat(firstCat);
  }
  React.useEffect(() => {
    setInitCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainCat(newCat);

    //setCounter(nextCounter);
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }
  function handleHeartClick() {
    if (alreadyFavorite) return;

    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const counterTitle = counter === null ? "" : counter + "번째";
  return (
    <div>
      <Title>{counterTitle}고양이 가라시대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
