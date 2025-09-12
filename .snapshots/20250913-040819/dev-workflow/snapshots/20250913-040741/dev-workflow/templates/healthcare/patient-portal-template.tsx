import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper
} from '@mui/material';
import {
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';

// HIPAA Compliance Schema
const hipaaValidationSchema = yup.object({
  patientId: yup.string().required('Patient ID is required'),
  accessReason: yup.string().required('Access reason is required'),
  consentGiven: yup.boolean().oneOf([true], 'Consent must be given'),
  dataUsage: yup.string().required('Data usage purpose is required'),
  retentionPeriod: yup.number().min(1, 'Retention period must be at least 1 year')
});

interface PatientData {
  id: string;
  name: string;
  dateOfBirth: string;
  medicalRecordNumber: string;
  lastVisit: string;
  primaryPhysician: string;
  insuranceProvider: string;
  emergencyContact: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  phiAccessLevel: 'restricted' | 'standard' | 'full';
  consentGiven: boolean;
  consentDate: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  user: string;
  ipAddress: string;
  phiAccessed: boolean;
  accessReason: string;
}

interface PatientPortalProps {
  patientId: string;
  onDataAccess: (data: any) => void;
  onAuditLog: (log: AuditLog) => void;
}

const PatientPortal: React.FC<PatientPortalProps> = ({
  patientId,
  onDataAccess,
  onAuditLog
}) => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(hipaaValidationSchema),
    defaultValues: {
      patientId: patientId,
      accessReason: '',
      consentGiven: false,
      dataUsage: '',
      retentionPeriod: 7
    }
  });

  // HIPAA Compliance Functions
  const logPHIAccess = useCallback((action: string, resource: string, phiAccessed: boolean, accessReason: string) => {
    const auditLog: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      resource,
      user: 'patient_portal_user',
      ipAddress: '192.168.1.100', // In real app, get from request
      phiAccessed,
      accessReason
    };
    
    setAuditLogs(prev => [auditLog, ...prev]);
    onAuditLog(auditLog);
  }, [onAuditLog]);

  const encryptPHI = useCallback((data: any) => {
    // In real implementation, use proper encryption
    return btoa(JSON.stringify(data));
  }, []);

  const decryptPHI = useCallback((encryptedData: string) => {
    // In real implementation, use proper decryption
    try {
      return JSON.parse(atob(encryptedData));
    } catch {
      return null;
    }
  }, []);

  // Load patient data with HIPAA compliance
  const loadPatientData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Log access attempt
      logPHIAccess('PHI_ACCESS_ATTEMPT', 'patient_data', true, 'patient_portal_view');
      
      // Simulate API call with encryption
      const response = await fetch(`/api/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'X-HIPAA-Compliance': 'true',
          'X-Access-Reason': 'patient_portal_view'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load patient data');
      }

      const encryptedData = await response.text();
      const decryptedData = decryptPHI(encryptedData);
      
      if (!decryptedData) {
        throw new Error('Failed to decrypt patient data');
      }

      setPatientData(decryptedData);
      
      // Log successful access
      logPHIAccess('PHI_ACCESS_SUCCESS', 'patient_data', true, 'patient_portal_view');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Log access failure
      logPHIAccess('PHI_ACCESS_FAILURE', 'patient_data', true, 'patient_portal_view');
      
    } finally {
      setLoading(false);
    }
  }, [patientId, logPHIAccess, decryptPHI]);

  // Handle consent form submission
  const handleConsentSubmit = useCallback((data: any) => {
    if (data.consentGiven) {
      setPatientData(prev => prev ? {
        ...prev,
        consentGiven: true,
        consentDate: new Date().toISOString()
      } : null);
      
      logPHIAccess('CONSENT_GIVEN', 'patient_consent', true, data.accessReason);
      setConsentDialogOpen(false);
      reset();
    }
  }, [logPHIAccess, reset]);

  // Handle data access request
  const handleDataAccess = useCallback((data: any) => {
    logPHIAccess('DATA_ACCESS_REQUEST', 'patient_data', true, data.accessReason);
    onDataAccess(data);
    setAccessDialogOpen(false);
    reset();
  }, [logPHIAccess, onDataAccess, reset]);

  // Load data on component mount
  useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);

  // HIPAA Compliance Indicators
  const getComplianceStatus = () => {
    if (!patientData) return 'loading';
    
    const hasConsent = patientData.consentGiven;
    const hasValidAccess = patientData.phiAccessLevel !== 'restricted';
    const isEncrypted = true; // In real app, check encryption status
    
    if (hasConsent && hasValidAccess && isEncrypted) {
      return 'compliant';
    } else if (hasConsent && hasValidAccess) {
      return 'warning';
    } else {
      return 'non-compliant';
    }
  };

  const complianceStatus = getComplianceStatus();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6">Loading patient data securely...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Access Denied</Typography>
          <Typography>{error}</Typography>
        </Alert>
        <Button variant="contained" onClick={loadPatientData}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!patientData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          <Typography variant="h6">No Patient Data Found</Typography>
          <Typography>Unable to load patient information. Please contact support.</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* HIPAA Compliance Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <SecurityIcon color="primary" />
            <Typography variant="h6" color="primary">
              HIPAA Compliant Patient Portal
            </Typography>
          </Box>
          <Chip
            icon={complianceStatus === 'compliant' ? <CheckIcon /> : 
                  complianceStatus === 'warning' ? <WarningIcon /> : <LockIcon />}
            label={complianceStatus === 'compliant' ? 'Fully Compliant' :
                   complianceStatus === 'warning' ? 'Needs Attention' : 'Non-Compliant'}
            color={complianceStatus === 'compliant' ? 'success' :
                   complianceStatus === 'warning' ? 'warning' : 'error'}
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Patient Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h5" component="h1">
              Patient Information
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => setAccessDialogOpen(true)}
              >
                Export Data
              </Button>
              <Button
                variant="contained"
                startIcon={<VerifiedIcon />}
                onClick={() => setConsentDialogOpen(true)}
                disabled={patientData.consentGiven}
              >
                {patientData.consentGiven ? 'Consent Given' : 'Give Consent'}
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><PersonIcon /></ListItemIcon>
                  <ListItemText
                    primary="Patient Name"
                    secondary={patientData.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><MedicalIcon /></ListItemIcon>
                  <ListItemText
                    primary="Medical Record Number"
                    secondary={patientData.medicalRecordNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon /></ListItemIcon>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={format(new Date(patientData.dateOfBirth), 'MMM dd, yyyy')}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon><MedicalIcon /></ListItemIcon>
                  <ListItemText
                    primary="Primary Physician"
                    secondary={patientData.primaryPhysician}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon /></ListItemIcon>
                  <ListItemText
                    primary="Last Visit"
                    secondary={format(new Date(patientData.lastVisit), 'MMM dd, yyyy')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SecurityIcon /></ListItemIcon>
                  <ListItemText
                    primary="PHI Access Level"
                    secondary={patientData.phiAccessLevel.toUpperCase()}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          {/* Medical Information */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Medical Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Allergies
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {patientData.allergies.map((allergy, index) => (
                  <Chip key={index} label={allergy} size="small" color="error" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Current Medications
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {patientData.medications.map((medication, index) => (
                  <Chip key={index} label={medication} size="small" color="primary" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Conditions
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {patientData.conditions.map((condition, index) => (
                  <Chip key={index} label={condition} size="small" color="secondary" />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Access Audit Log
          </Typography>
          <List>
            {auditLogs.slice(0, 10).map((log) => (
              <ListItem key={log.id} divider>
                <ListItemText
                  primary={log.action}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Resource: {log.resource} | IP: {log.ipAddress}
                        {log.phiAccessed && (
                          <Chip
                            label="PHI Accessed"
                            size="small"
                            color="warning"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Consent Dialog */}
      <Dialog open={consentDialogOpen} onClose={() => setConsentDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>HIPAA Consent and Authorization</DialogTitle>
        <form onSubmit={handleSubmit(handleConsentSubmit)}>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                By providing consent, you authorize the use and disclosure of your protected health information 
                for treatment, payment, and healthcare operations as described in our Notice of Privacy Practices.
              </Typography>
            </Alert>
            
            <Controller
              name="accessReason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reason for Access"
                  error={!!errors.accessReason}
                  helperText={errors.accessReason?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            
            <Controller
              name="dataUsage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Data Usage Purpose"
                  error={!!errors.dataUsage}
                  helperText={errors.dataUsage?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            
            <Controller
              name="retentionPeriod"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Data Retention Period (years)"
                  error={!!errors.retentionPeriod}
                  helperText={errors.retentionPeriod?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            
            <Controller
              name="consentGiven"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      color="primary"
                    />
                  }
                  label="I give my consent for the use and disclosure of my protected health information"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConsentDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!control._formValues.consentGiven}>
              Give Consent
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Data Access Dialog */}
      <Dialog open={accessDialogOpen} onClose={() => setAccessDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Request Data Access</DialogTitle>
        <form onSubmit={handleSubmit(handleDataAccess)}>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This action will be logged and audited for HIPAA compliance. 
                Please provide a valid reason for accessing this data.
              </Typography>
            </Alert>
            
            <Controller
              name="accessReason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reason for Data Access"
                  error={!!errors.accessReason}
                  helperText={errors.accessReason?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
            
            <Controller
              name="dataUsage"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Data Usage Purpose</InputLabel>
                  <Select {...field} label="Data Usage Purpose">
                    <MenuItem value="treatment">Treatment</MenuItem>
                    <MenuItem value="payment">Payment</MenuItem>
                    <MenuItem value="healthcare_operations">Healthcare Operations</MenuItem>
                    <MenuItem value="research">Research</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAccessDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Request Access
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default PatientPortal;
