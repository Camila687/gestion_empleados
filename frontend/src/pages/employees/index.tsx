import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Pagination,
  Modal,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import axios from '../../utils/axios';
import CloseIcon from '@mui/icons-material/Close';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  salary: number;
  document: string;
  user?: {
      first_name: string;
      last_name: string;
      email: string;
  };
}

export default function Empleados() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 50;
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<Employee | { [key: string]: any } | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`/api/employees?page=${page}&limit=${rowsPerPage}`);
      console.log(response.data);
      setEmployees(response.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      setSelectedEmployee(response.data);
      setEditedEmployee(response.data);
      setOpenModal(true);
    } catch (error) {
        console.error('Error al obtener empleado para editar:', error);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
        console.error('Error al dar de baja empleado:', error);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
    setEditedEmployee(null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    if (editedEmployee) {
      if (name === 'first_name' || name === 'last_name' || name === 'email' || name === 'password') {
        setEditedEmployee({
          ...editedEmployee,
          user: {
            ...editedEmployee.user,
            [name]: value
          }
        });
      } else {
        setEditedEmployee({
          ...editedEmployee,
          [name]: value
        });
      }
    }
  };

  const handleSave = async () => {
    if (editedEmployee) {
      try {
        const dataToSend = {
          id: editedEmployee.id,
          job_title: editedEmployee.job_title,
          salary: editedEmployee.salary,
          document: editedEmployee.document,
          first_name: editedEmployee.user.first_name,
          last_name: editedEmployee.user.last_name,
          email: editedEmployee.user.email,
          password: editedEmployee.user.password
        };
        
        await axios.put(`/api/employees/${editedEmployee.id}`, dataToSend);
        fetchEmployees();
        handleModalClose();
      } catch (error) {
        console.error('Error al guardar cambios:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Lista de Empleados
        </Typography>
        <Button
          variant="contained"
          href="/employees/nuevo"
          sx={{ mb: 3 }}
        >
          Alta de empleado
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Salario</TableCell>
              <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => {
                console.log(employee);
                return(
                <TableRow key={employee.id}>
                  <TableCell>
                    {employee.first_name && employee.last_name
                      ? `${employee.first_name} ${employee.last_name}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {employee.email || 'N/A'}
                  </TableCell>
                  <TableCell>{employee.document}</TableCell>
                  <TableCell>{employee.job_title}</TableCell>
                  <TableCell>{employee.salary}</TableCell>
                  <TableCell>
                  <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(employee.id)}
                      sx={{ mr: 1 }}
                  >
                      Editar
                  </Button>
                  <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleDeactivate(employee.id)}
                  >
                      Dar de baja
                  </Button>
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{ mt: 2 }}
        />
      </Paper>
    <Modal open={openModal} onClose={handleModalClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                    Editar Empleado
                </Typography>
                <IconButton onClick={handleModalClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            {editedEmployee && (
                <>
                    <TextField label="Nombre" fullWidth margin="normal" name="first_name" value={editedEmployee.user.first_name || ''} onChange={handleInputChange} />
                    <TextField label="Apellido" fullWidth margin="normal" name="last_name" value={editedEmployee.user.last_name || ''} onChange={handleInputChange} />
                    <TextField label="Email" fullWidth margin="normal" name="email" value={editedEmployee.user.email || ''} onChange={handleInputChange} />
                    <TextField label="Cargo" fullWidth margin="normal" name="job_title" value={editedEmployee.job_title || ''} onChange={handleInputChange} />
                    <TextField label="Salario" fullWidth margin="normal" name="salary" value={editedEmployee.salary || ''} onChange={handleInputChange} />
                    <TextField label="Documento" fullWidth margin="normal" name="document" value={editedEmployee.document || ''} onChange={handleInputChange} />
                    <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>Guardar</Button>
                </>
            )}
        </Box>
    </Modal>
    </Container>
  );
}