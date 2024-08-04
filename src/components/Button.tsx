import Button from '@mui/material/Button';

export default function ButtonUsage(props: {text:string}) {

  return <Button variant="contained">{props.text}</Button>;
}