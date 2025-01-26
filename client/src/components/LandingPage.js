import React from "react";
import { Tabs } from "antd";
import WatchVideo from "./WatchVideo";
import Summary from "./Summary";
import Quiz from "./Quiz";
import Translation from "./Translation";
import Timestamp from "./Timestamp";
import { Video, FileText, BrainCircuit, Globe, Clock } from "lucide-react";

const LandingPage = () => {
  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2 px-2">
          <Video className="w-4 h-4" />
          <span>Watch Video</span>
        </div>
      ),
      children: <WatchVideo />,
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2 px-2">
          <FileText className="w-4 h-4" />
          <span>Summary</span>
        </div>
      ),
      children: <Summary />,
    },
    {
      key: "3",
      label: (
        <div className="flex items-center gap-2 px-2">
          <BrainCircuit className="w-4 h-4" />
          <span>Take Quiz</span>
        </div>
      ),
      children: <Quiz />,
    },
    {
      key: "4",
      label: (
        <div className="flex items-center gap-2 px-2">
          <Globe className="w-4 h-4" />
          <span>Translation</span>
        </div>
      ),
      children: <Translation />,
    },
    {
      key: "5",
      label: (
        <div className="flex items-center gap-2 px-2">
          <Clock className="w-4 h-4" />
          <span>Timestamp</span>
        </div>
      ),
      children: <Timestamp />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-blue-100/30">
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 py-4 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center gap-3 justify-center">
              <Video className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                EduAId Companion
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Tabs
              defaultActiveKey="1"
              items={items}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-4"
              tabBarStyle={{
                marginBottom: 24,
                borderBottom: "1px solid #e2e8f0",
                padding: "0 16px",
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
