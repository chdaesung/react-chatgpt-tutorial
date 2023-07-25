import { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "your_organization_here",
  apiKey: "your_apikey_here",
});
const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    scrollTo(0,1e10)

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Your role is software developer",
          },
          ...chats,
        ],
      })
      .then((res) => {
        msgs.push(res.data.choices[0].message);
        console.log('dimesion of res.data.choices is : ', [res.data.choices.length, res.data.choices[0].length]);
        console.log('Index value is :', res.data.choices[0].index);
        console.log('message is : ', res.data.choices[0].message);
        console.log('Content of message :', res.data.choices[0].message.content);
        setChats(msgs);
        setIsTyping(false);
        scrollTo(0,1e10)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main>
      <h1>Chat AI Tutorial</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => {
              console.log("Chat Content:", chat.content); // Add this line to print the value to the console
              return (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
            <span>
              <b>{chat.role.toUpperCase()}</b>
            </span>
            <span>:</span>
            <span>{chat.content}</span>
          </p>
        );
      })
    : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;
