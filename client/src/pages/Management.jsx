import { useState } from "react";
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
} from "@mui/material";

const rows = [
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

const Management = () => {
  // const [state, setState] = useState({
  //   users: [],
  //   loading: true,
  // });
  const [openModal, setOpenModal] = useState(false);
  const [role, setRole] = useState("Student");

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
                label="Required"
              />
              <TextField
                sx={{
                  width: "100%",
                }}
                required
                id="outlined-required"
                label="Required"
              />
            </Box>

            <TextField
              sx={{
                width: "100%",
                mb: 2,
              }}
              required
              id="outlined-required"
              label="Required"
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
              sx={{
                mt: 5,
              }}
              variant="contained"
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Management;
