import { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Box,
} from '@mui/material';
import axios from '../../utils/axios';
import { useRouter } from 'next/router';

export default function NuevoEmpleado() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [document, setDocument] = useState('');
    const [salary, setSalary] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/employees', {
                first_name,
                last_name,
                email,
                password,
                isAdmin,
                job_title: jobTitle,
                document,
                salary,
            });
            alert('Empleado creado con éxito');
            router.push('/employees');
        } catch (error: any) {
            console.error('Error al crear empleado:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error al crear empleado: ${error.response.data.message}`);
            } else {
                alert('Error al crear empleado. Por favor, inténtalo de nuevo.');
            }
        }
    };


    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nuevo Empleado
        </Typography>
        <form onSubmit={handleSubmit}>
            <TextField
                label="Nombre"
                fullWidth
                margin="normal"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <TextField
                label="Apellido"
                fullWidth
                margin="normal"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            <TextField
                label="Correo electrónico"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="Contraseña"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                }
                label="Administrador"
            />
            <TextField
                label="Puesto"
                fullWidth
                margin="normal"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
            />
            <TextField
                label="Documento de identidad"
                fullWidth
                margin="normal"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                required
            />
            <TextField
                label="Salario"
                fullWidth
                margin="normal"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
            />
            <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                    Crear Empleado
                </Button>
            </Box>
        </form>
      </Container>
    );
  }