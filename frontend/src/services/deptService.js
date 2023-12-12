import axios from "axios";

export default {
    addMembers: async (members) => await axios.post(
        "http://localhost:8082/members/admin/654b0762060d663ea36e709a/add",
        members,
        {
            headers: {
                authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTRiMDUwMDBiMTA4NTRhNTRiZDRmMTMiLCJpYXQiOjE3MDExNTc5MzcsImV4cCI6MTcwMzc0OTkzN30.Ad2SZJ0tvwmn8B7EC0QJie4jYdLIl7YupqFBrXCF-DE`,
                "Content-Type": "application/json",
            },
        }
    )
}