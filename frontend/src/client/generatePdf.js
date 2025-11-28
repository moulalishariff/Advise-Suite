// import axios from "axios";
// import { toast } from "react-toastify";
// export const sendPDFToBackend = async (pdfBlob, eEmail) => {
//     const formData = new FormData();
//     formData.append("pdf", pdfBlob, `Portfolio-Report.pdf`);
//     formData.append("clientEmail", eEmail);

//     try {
//         const response = await axios.post("http://localhost:8080/api/portfolios/send-pdf-to-client", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//         toast.success(response.data);  // Display success message from backend
//     } catch (err) {
//         console.error("Error sending PDF to backend:", err);
//         toast.error("Failed to send PDF for review.");
//     }
// };

// import axios from "axios";
// import { toast } from "react-toastify";

// export const sendPDFToBackend = async (pdfBlob, clientEmail) => {
//     try {
//         const formData = new FormData();
//         formData.append("pdf", pdfBlob, `Portfolio-Report.pdf`);
//         formData.append("clientEmail", clientEmail); 
        
//         const token = 'your-jwt-token';  // Retrieve the token from the client-side (localStorage/sessionStorage)
//         const response = await axios.post("http://localhost:8080/api/portfolios/send-pdf-to-client", formData, {
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//         toast.success(response.data);  // Display success message from backend
//     } catch (err) {
//         // Step 4: Handle errors
//         console.error("Error sending PDF to backend:", err);
//         toast.error("Failed to send PDF for review.");  // Show error message if something goes wrong
//     }
// };

import axios from "axios";
import { toast } from "react-toastify";

export const sendPDFToBackend = async (pdfBlob, clientEmail) => {
    try {
        const formData = new FormData();
        formData.append("pdf", pdfBlob, `Portfolio-Report.pdf`);
        formData.append("clientEmail", clientEmail); 
        
        // Retrieve the token dynamically from localStorage or sessionStorage
        const token = localStorage.getItem('token');  // Make sure to replace this with your token storage method
        if (!token) {
            throw new Error("JWT token not found");
        }

        const response = await axios.post("http://localhost:8080/api/portfolios/send-pdf-to-client", formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        toast.success(response.data);  // Display success message from backend
    } catch (err) {
        console.error("Error sending PDF to backend:", err);
        toast.error("Failed to send PDF for review.");  // Show error message if something goes wrong
    }
};
