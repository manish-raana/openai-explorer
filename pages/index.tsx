import axios from "axios";
import { useState, useEffect } from "react";
import Gallery from "../components/Gallery";

export default function Home() {
  const [promptText, setPromptText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedSize, setSelectedSize] = useState("small");
  const [imageUrlList, setImageUrlList] = useState<Array<{id:number,imageUrl:string}>>([]);

  useEffect(() => {
    //getImagesList();
  }, []);

  const getImagesList = async () => {
    const res = await axios.get("/api/images");
    const imagesList = res.data.data;
    console.log(imagesList);
    if (imagesList && imagesList.length > 0) {
      setImageUrlList(imagesList);
    };
  }

  const storeImage = async(imageUrl:string) => {
     axios
       .post("/api/images", {
         imageUrl: imageUrl,
         createdOn:Date.now()
       })
       .then(function (response) {
         //console.log(response);
       })
       .catch(function (error) {
         console.log(error);
       })
       .finally(() => {
         
       });
  }
  const getImage = () => {
    if (!promptText || promptText == "") {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 1000);
      return;
    }
    setLoading(true);
    setImageUrl(null);
    //console.log("prompt-text: ", promptText);
    axios
      .post("/api/generateImage", {
        prompt: promptText,
        size: selectedSize,
      })
      .then(function (response) {
        if (response && response?.data.data) {
          setImageUrl(response.data.data);
         
          imageUrlList.unshift({
            id: Date.now(),
            imageUrl: response.data.data,
          });

          storeImage(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        setPromptText("");
        setIsError(false);
      });
  };

  return (
    <div className="bg-neutral w-full overflow-hidden flex flex-col items-center">
      {isError && (
        <div className="toast toast-top toast-center z-auto w-full">
          <div className="alert alert-error">
            <div>
              <span>Please enter a valid text</span>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center w-full items-center pt-5">
        {/* <input
          type="text"
          placeholder="Type some words here"
          className="input input-bordered focus:outline-none input-primary w-full max-w-xl mx-5"
          onChange={(e) => setPromptText(e.target.value)}
        /> */}
        <div className="form-control w-1/2">
          <label className="input-group">
            <input
              type="text"
              placeholder="Type some words here"
              value={promptText}
              className="z-0 input input-bordered focus:outline-none input-primary w-full max-w-xl"
              onChange={(e) => setPromptText(e.target.value)}
            />

            <select className="w-32 bg-primary focus:outline-none" onChange={(e) => setSelectedSize(e.target.value)}>
              <option key={1} value="small">
                Small
              </option>
              <option key={2} value="medium">
                Medium
              </option>
              <option key={3} value="large">
                Large
              </option>
            </select>
          </label>
        </div>
        <button disabled={loading} className="btn btn-primary mx-5" onClick={() => getImage()}>
          Generate Image
        </button>
      </div>
      <div className="z-10 border-dotted border-2 rounded-xl mt-5 border-gray-700 w-5/6 h-[550px] flex flex-col items-center justify-center">
        {loading && <img src="loading.svg" alt="loading" />}
        {(!imageUrl && !loading) && (
          <div>
            <img src="./temp.gif" alt="temp" className="h-48" />
            <p>Type your thoughts and generate...</p>
          </div>
        )}
        {imageUrl && <img className="rounded-xl h-5/6" src={imageUrl} alt="loading" />}
      </div>
      <div className="mt-5 text-center">
        {/* <p className="font-bold text-2xl">Recently Generated Images</p> */}
        {/* <Gallery imageUrlList={imageUrlList} /> */}
      </div>
    </div>
  );
}