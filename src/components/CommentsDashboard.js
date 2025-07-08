// File: src/components/CommentsDashboard.js
import React, { useEffect, useState } from "react";
import "../styles/CommentsDashboard.css";
import { useNavigate } from "react-router-dom";

const CommentsDashboard = () => {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dashboardState"));
    if (stored) {
      setSearch(stored.search || "");
      setPageSize(stored.pageSize || 10);
      setPage(stored.page || 1);
      setSortConfig(stored.sortConfig || { key: "", direction: "" });
    }

    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "dashboardState",
      JSON.stringify({ search, page, pageSize, sortConfig })
    );
  }, [search, page, pageSize, sortConfig]);

  const filtered = comments.filter((item) =>
    [item.name, item.email, item.body].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key || sortConfig.direction === "") return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const cycleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "") return { key, direction: "asc" };
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: "", direction: "" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="logo">SWIFT</div>
        <div className="user-chip">
          <span>EH</span>
          <span>Ervin Howell</span>
        </div>
      </div>
      <div className="toolbar">
        <div className="sort-selects">
          <button onClick={() => cycleSort("postId")}>Sort Post ID</button>
          <button onClick={() => cycleSort("name")}>Sort Name</button>
          <button onClick={() => cycleSort("email")}>Sort Email</button>
        </div>
        <input
          type="text"
          placeholder="Search name, email, comment"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <button onClick={() => navigate("/profile")}>Go to Profile</button>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => cycleSort("postId")}>Post ID</th>
            <th onClick={() => cycleSort("name")}>Name</th>
            <th onClick={() => cycleSort("email")}>Email</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((item) => (
            <tr key={item.id}>
              <td>{item.postId}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="pagesize-select">
        <select value={pageSize} onChange={(e) => {
          setPageSize(Number(e.target.value));
          setPage(1);
        }}>
          <option value={10}>10 / Page</option>
          <option value={50}>50 / Page</option>
          <option value={100}>100 / Page</option>
        </select>
      </div>
    </div>
  );
};

export default CommentsDashboard;
