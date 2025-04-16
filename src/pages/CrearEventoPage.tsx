import { Box } from '@mui/material'
import { CreateEventForm } from '../components/CrearEventoForm'

const CrearEventoPage = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto"}}>
        <CreateEventForm/>
    </Box>
  )
}

export default CrearEventoPage