import React from "react";
import { Tabs } from "antd";
import WatchVideo from "./WatchVideo";
import Summary from "./Summary";
import Quiz from "./Quiz";

const LandingPage = () => {
  const items = [
    {
      key: "1",
      label: "Watch Video",
      children: <WatchVideo />,
    },
    {
      key: "2",
      label: "Summary",
      children: <Summary />,
    },
    {
      key: "3",
      label: "Take Quiz",
      children: <Quiz />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow"
      />
    </div>
  );
};

export default LandingPage;
