import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";

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
  const [state, setState] = useState({
    users: [],
    loading: true,
  });

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
        >
          Add User
        </Button>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </Box>
  );
};

export default Management;
