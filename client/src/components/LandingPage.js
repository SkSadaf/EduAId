import React from "react";
import { Tabs } from "antd";
import WatchVideo from "./WatchVideo";
import Summary from "./Summary";
import Quiz from "./Quiz";
import Translation from "./Translation";

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
    {
      key: "4",
      label: "Translation",
      children: <Translation />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-screen flex flex-col">
        <header className="bg-white shadow p-6">
          <h1 className="text-2xl text-center font-bold text-black">
            Your vAIdeo Companion
          </h1>
        </header>
        <main className="flex-1 p-2 overflow-auto">
          <Tabs
            defaultActiveKey="1"
            items={items}
            className="h-full text-center bg-white p-4 rounded-lg shadow custom-tabs"
          />
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
