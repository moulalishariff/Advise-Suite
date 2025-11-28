// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";

// const ConsultantPendingRequests = () => {
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const confirmToast = (message, onConfirm) => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           <p>{message}</p>
//           <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
//             <button onClick={() => { closeToast(); onConfirm(); }} style={{ padding: "5px 10px", background: "green", color: "white", border: "none", borderRadius: "4px" }}>
//               Yes
//             </button>
//             <button onClick={closeToast} style={{ padding: "5px 10px", background: "red", color: "white", border: "none", borderRadius: "4px" }}>
//               No
//             </button>
//           </div>
//         </div>
//       ),
//       {
//         position: "top-center",
//         autoClose: false,
//         closeOnClick: false,
//         closeButton: false,
//       }
//     );
//   };
  
//   // Fetch pending PDF requests when the component mounts
//   useEffect(() => {
//     const fetchPendingRequests = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/pdf/pending");
//         setPendingRequests(response.data);
//       } catch (error) {
//         toast.error("Failed to fetch pending requests.");
//       }
//     };
//     fetchPendingRequests();
//   }, []);

//   const handleRequestResponse = (requestId, action) => {
//     confirmToast(`Are you sure you want to ${action} this request?`, async () => {
//       try {
//         await axios.post(`/api/pdf/${requestId}/respond?action=${action}`);
//         toast.success(`Request ${action}ed successfully.`, { position: "top-center" });
//         const updatedRequests = await axios.get("http://localhost:8080/api/pdf/pending");
//         setPendingRequests(updatedRequests.data);
//       } catch (error) {
//         toast.error("Failed to process request.");
//       }
//     });
//   };  

//   return (
//     <div className="consultant-pending-requests-container">
//       <ToastContainer />
//       <h2>Pending PDF Requests</h2>
//       <div className="pending-requests-list">
//         {pendingRequests.length > 0 ? (
//           <ul>
//             {pendingRequests.map((request) => (
//               <li key={request.id} className="request-item">
//                 <div>
//                   <strong>Beta ID:</strong> {request.betaId} <br />
//                   <strong>Status:</strong> {request.status} <br />
//                   <strong>Portfolios:</strong> {request.portfolios.join(", ")}
//                 </div>
//                 <div className="request-actions">
//                   <button
//                     onClick={() => handleRequestResponse(request.id, "accept")}
//                     className="accept-btn"
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => handleRequestResponse(request.id, "reject")}
//                     className="reject-btn"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No pending requests.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConsultantPendingRequests;
