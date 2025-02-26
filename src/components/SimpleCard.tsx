import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CardField {
  key: string;
  label: string;
}

interface CardData {
  id: number | string;
  [key: string]: any;
}

interface SimpleCardProps {
  fields: CardField[];
  data: CardData;
  onEdit: (editedData: CardData) => void;
  onDelete: (id: number | string) => void;
  customRender?: {
    [key: string]: (value: any) => React.ReactNode;
  };
  imageUrl?: string;
  title: string;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  fields,
  data,
  onEdit,
  onDelete,
  customRender,
  imageUrl,
  title,
}) => {
  return (
    <Card
      sx={{
        maxWidth: 360,
        m: 2,
        borderRadius: 3,
        boxShadow: 3,
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      {imageUrl && (
        <CardMedia sx={{ height: 160 }} image={imageUrl} title={title} />
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
          {title}
        </Typography>
        {fields.map((field) => (
          <Typography key={field.key} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <strong>{field.label}:</strong>{' '}
            {customRender && customRender[field.key]
              ? customRender[field.key](data[field.key])
              : data[field.key]}
          </Typography>
        ))}
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <IconButton
          onClick={() => onEdit(data)}
          size="small"
          aria-label="edit"
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => onDelete(data.id)}
          size="small"
          aria-label="delete"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default SimpleCard;
