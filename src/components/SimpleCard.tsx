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
    <Card sx={{ maxWidth: 345, m: 2 }}>
      {imageUrl && (
        <CardMedia
          sx={{ height: 140 }}
          image={imageUrl}
          title={title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        {fields.map((field) => (
          <Typography key={field.key} variant="body2" color="text.secondary">
            <strong>{field.label}:</strong>{' '}
            {customRender && customRender[field.key]
              ? customRender[field.key](data[field.key])
              : data[field.key]}
          </Typography>
        ))}
      </CardContent>
      <CardActions>
        <IconButton onClick={() => onEdit(data)} size="small" aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(data.id)} size="small" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default SimpleCard;