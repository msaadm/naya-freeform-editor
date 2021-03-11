import React from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';

import './App.css';

function App() {

  const [tool, _] = React.useState('pen');
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);
  const [user, setUser] = React.useState({});
  const [username, setUsername] = React.useState("");
  const [sketchUsers, setSketchUsers] = React.useState([]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, stroke:user.color, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  async function getSketch() {
    fetch("http://localhost:5000/api/sketches", {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(function(response) {
      return response.json();
    })
      .then(
        (data) => {
          console.log(data);
          setLines(data.lines)
          setSketchUsers(data.users)
        })    
  }

  async function saveSketch() {
    fetch("http://localhost:5000/api/sketches", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lines: lines,
        user: user
      })
    })
    .then(function(response) {
      return response.json();
    })
      .then(
        (data) => {
          setSketchUsers(data.users)
          alert("Sketch Saved");
        })    
  }

  async function getUser() {
    fetch("http://localhost:5000/api/users", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    })
    .then(function(response) {
      return response.json();
    })
      .then(
        (data) => {
          console.log(data);
          setUser({ name: username, color: data.color } || {});
          getSketch();
        }) 
  }

  return (
    <div className="App">
      <div>
        <h1>Free Form Editor</h1>
        {!(user.name && user.color) ?
          <form onSubmit={e => {
            e.preventDefault();
            getUser();
          }}>
            <label>Enter your name and click submit</label>
            <input type="text" name="username" required minLength={3} onChange={e => setUsername(e.target.value)} />
            <button >Submit</button>
          </form>
          :
          <>
            <button onClick={e => saveSketch()}>Save Sketch</button>
            <div className="sketch-users">
              {sketchUsers.map((user) => (
                <div className="sketch-user" key={user.name}>
                  <span style={{ background: `${user.color}` }}></span>
                  <strong dangerouslySetInnerHTML={{ __html: user.name }}></strong>
                </div>
            ))}
            </div>
          <Stage
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              <Text text="Just start drawing" x={5} y={30} />
              <Text text={"User Name: " + username} x={5} y={50} />
              <Text text={"User Color: " + user.color} x={5} y={70} />
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.stroke}
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
          </>
        }
      </div>
    </div>
  );
}

export default App;
