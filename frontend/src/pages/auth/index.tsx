import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import axios from '../../utils/axios';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  job_title: string;
  salary: number;
  documents: Array<{
    id: number;
    document_name: string;
    upload_date: string;
  }>;
}

export default function MiPerfil() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/employees/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
    }
  };

  if (!profile) return <div>Cargando...</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>
            <Typography>
              Nombre: {profile.firstName} {profile.lastName}
            </Typography>
            <Typography>Email: {profile.email}</Typography>
            <Typography>Cargo: {profile.job_title}</Typography>
            <Typography>Salary: {profile.salary}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Documentos
            </Typography>
            <Button
              variant="contained"
              href="/documents/subir"
              sx={{ mb: 2 }}
            >
              Subir Documento
            </Button>
            <List>
              {profile.documents.map((doc) => (
                <ListItem key={doc.id}>
                  <ListItemText
                    primary={doc.document_name}
                    secondary={new Date(doc.upload_date).toLocaleDateString()}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(`/api/documents/${doc.id}/download`)}
                  >
                    Descargar
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}