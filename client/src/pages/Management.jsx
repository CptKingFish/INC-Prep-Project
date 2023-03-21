import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const columns = [
  { field: "email", headerName: "E-mail", width: 350 },
  { field: "firstname", headerName: "First Name", width: 300 },
  { field: "lastname", headerName: "Last Name", width: 300 },
  { field: "role", headerName: "Role", width: 200 },
  { field: "status", headerName: "Status", width: 200 },
  {
    field: "edit",
    headerName: "Edit",
    width: 75,
    renderCell: (params) => {
      const onClick = () => {
        // const data = params.row;
        // setUpdateModelData({
        //   id: data.id,
        //   email: data.email,
        //   name: data.name,
        //   course: data.course,
        //   className: data.class,
        // });
        // const id = params.row.id;
        // // updateDB({
        // //   id: id,
        // //   data: {},
        // // });
        // setOpenUpdateModel(true);
        // console.log("done");
      };

      return (
        <IconButton aria-label="delete" onClick={onClick}>
          <EditIcon />
        </IconButton>
      );
    },
  },
  {
    field: "delete",
    headerName: "Delete",
    width: 75,
    renderCell: (params) => {
      const onClick = () => {
        // const data = params.row;
        // setUpdateModelData({
        //   id: data.id,
        //   email: data.email,
        //   name: data.name,
        //   course: data.course,
        //   className: data.class,
        // });
        // const id = params.row.id;
        // // updateDB({
        // //   id: id,
        // //   data: {},
        // // });
        // setOpenUpdateModel(true);
        // console.log("done");
      };

      return (
        <IconButton aria-label="delete" onClick={onClick}>
          <DeleteIcon />
        </IconButton>
      );
    },
  },
];

const defaultRows = [
  {
    id: 1,
    firstname: "Hello",
    lastname: "World",
    email: "hello@gmail.com",
    role: "Student",
    status: "Sent",
  },
  {
    id: 2,
    firstname: "Hello",
    lastname: "World",
    email: "hello@gmail.com",
    role: "Student",
    status: "Sent",
  },
  {
    id: 3,
    firstname: "Hello",
    lastname: "World",
    email: "hello@gmail.com",
    role: "Student",
    status: "Sent",
  },
];

const Management = () => {
  const axiosPrivate = useAxiosPrivate();
  const [openModal, setOpenModal] = useState(false);
  const [role, setRole] = useState("Student");
  const [rows, setRows] = useState(defaultRows);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (firstName === "" || lastName === "" || email === "") {
      alert("Please fill all the fields");
      return;
    }

    if (!new RegExp(/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/).test(email)) {
      alert("Please enter a valid email");
      return;
    }

    try {
      const response = await axiosPrivate.post(
        "http://localhost:3500/admin/adduser",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
        },
        {
          withCredentials: true,
        }
      );
      const { data, status } = response;
      // let verification_status = "email sent";
      // if (!data.ok) {
      //   alert("Something went wrong. Please try again later");
      //   verification_status = "email not sent";
      // }

      console.log("res is here__________________________", response);
    } catch (error) {
      console.error(error);
    }

    const newRows = [
      ...rows,
      {
        id: rows.length + 1,
        firstname: firstName,
        lastname: lastName,
        email: email,
        role: role,
        status: "Sent",
      },
    ];
    setRows(newRows);
    setOpenModal(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "85vh",
      }}
    >
      <h1>Management</h1>
      <p>The Management Page is accessible by every signed in admin.</p>

      <div style={{ height: 300, width: "80%", textAlign: "end" }}>
        <Button
          variant="outlined"
          sx={{
            mb: 2,
          }}
          onClick={() => setOpenModal(true)}
        >
          Add User
        </Button>
        <DataGrid rows={rows} columns={columns} />
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                }}
                id="modal-modal-title"
                variant="h5"
              >
                Add new user
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <TextField
                  sx={{
                    mr: 1,
                    width: "100%",
                  }}
                  required
                  id="outlined-required"
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                  sx={{
                    width: "100%",
                  }}
                  required
                  id="outlined-required"
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Box>
              <TextField
                sx={{
                  width: "100%",
                  mb: 2,
                }}
                required
                id="outlined-required"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select
                sx={{
                  width: "100%",
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value={"Admin"}>Admin</MenuItem>
                <MenuItem value={"Officer"}>Officer</MenuItem>
                <MenuItem value={"Student"}>Student</MenuItem>
              </Select>
              <Button
                type="submit"
                sx={{
                  mt: 5,
                }}
                variant="contained"
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Management;
