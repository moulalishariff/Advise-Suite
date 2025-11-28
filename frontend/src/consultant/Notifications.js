// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./css/Notifications.css";

// const Notifications = () => {
//   const [requests, setRequests] = useState([]);

//   const fetchRequests = async () => {
//     try {
//         const res = await axios.get("http://localhost:8080/api/pdf/pending");

//     setRequests(res.data);
//     } catch (err) {
//       console.error("Failed to fetch pending requests", err);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const respondToRequest = async (id, action) => {
//     try {
//         await axios.post(`http://localhost:8080/api/pdf/${id}/respond?action=${action}`);
//       setRequests(prev => prev.filter(req => req.id !== id));
//     } catch (err) {
//       console.error(`Failed to ${action} request`, err);
//     }
//   };

//   return (
//     <div className="notifications">
//       <h2>Pending PDF Requests</h2>
//       {requests.length === 0 ? (
//         <p>No notifications.</p>
//       ) : (
//         requests.map(req => (
//           <div key={req.id} className="notification-card">
//             <p><strong>Client Beta ID:</strong> {req.betaId}</p>
//             <p><strong>Requested At:</strong> {new Date(req.requestedAt).toLocaleString()}</p>
//             <div className="notification-actions">
//               <button onClick={() => respondToRequest(req.id, "accept")}>Accept</button>
//               <button onClick={() => respondToRequest(req.id, "reject")}>Reject</button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Notifications;
