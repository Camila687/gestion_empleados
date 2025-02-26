import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from '../../utils/axios';

interface DocumentType {
  id: number;
  name: string;
}

export default function SubirDocumento() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  useEffect(() => {
      fetchDocumentTypes();
      fetchEmployeeId();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
        const response = await axios.get('/api/documents/types');
        setDocumentTypes(response.data);
    } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
    }
  };

  const fetchEmployeeId = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Objeto user:', user); 
        if (user && user.id) { 
            setEmployeeId(user.id);
        } else {
            console.error('Estructura de usuario incorrecta en localStorage', user); 
        }
    } catch (error) {
        console.error('Error al obtener employeeId:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !employeeId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentTypeId', documentType);
    formData.append('employeeId', employeeId.toString());

    try {
      await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/auth');
    } catch (error) {
      console.error('Error al subir documento:', error);
    }
  };

  console.log('file:', file);
    console.log('documentType:', documentType);
    console.log('employeeId:', employeeId);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Subir Documento
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de documento</InputLabel>
              <Select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Seleccionar
                </MenuItem>
                {documentTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ marginTop: 16 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={!file || !documentType || !employeeId}
            >
              Subir
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}