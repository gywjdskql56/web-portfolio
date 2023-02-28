import { Card, styled } from "@mui/material";

// ===============================================

// ===============================================

const BazaarCard = styled(({
  hoverEffect,
  children,
  ...rest
}) => <Card {...rest}>{children}</Card>)(({
  theme,
  hoverEffect
}) => ({
  overflow: "unset",
  borderRadius: "8px",
  transition: "all 250ms ease-in-out",
  "&:hover": {
    ...(hoverEffect && {
      boxShadow: theme.shadows[3],
      backgroundColor: "#F58220",
    })
  },
  "&:activate": {
    boxShadow: theme.shadows[3],
    backgroundColor: "#FF0000",
    borderColor: "#0062cc"
  },
  "&:focus": {
    backgroundColor: "#FF0000",
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)"
  }
}));
BazaarCard.defaultProps = {
  hoverEffect: false
};
export default BazaarCard;