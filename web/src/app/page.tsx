import Sidebar from "@/components/Sidebar";
import TopicList from "@/components/TopicList";

export default function Home() {
  return (
    <div className="container">
      <div className="layout">
        <Sidebar />
        <main>
          <TopicList />
        </main>
      </div>
    </div>
  );
}
