import { useState } from "react";
import { Button, Card, Checkbox, FormControlLabel, Grid, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import DropZone from "components/DropZone";
import { FlexBox } from "components/flex-box";
import BazaarImage from "components/BazaarImage";
import { UploadImageBox, StyledClear } from "../StyledComponents";

// ================================================================

// ================================================================

const CategoryForm = props => {
  const {
    initialValues,
    validationSchema,
    handleFormSubmit
  } = props;
  const [files, setFiles] = useState([]);

  // HANDLE UPDATE NEW IMAGE VIA DROP ZONE
  const handleChangeDropZone = files => {
    files.forEach(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(files);
  };

  // HANDLE DELETE UPLOAD IMAGE
  const handleFileDelete = file => () => {
    setFiles(files => files.filter(item => item.name !== file.name));
  };
  return <Card sx={{
    p: 6
  }}>
      <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={validationSchema}>
        {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit
      }) => <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField fullWidth name="name" label="카테고리명" color="info" size="medium" placeholder="카테고리명" value={values.name} onBlur={handleBlur} onChange={handleChange} error={!!touched.name && !!errors.name} helperText={touched.name && errors.name} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField select fullWidth color="info" size="medium" name="parent" onBlur={handleBlur} value={values.parent} onChange={handleChange} placeholder="상위 카테고리" label="상위 카테고리를 선택해주세요." SelectProps={{
              multiple: true
            }}>
                  <MenuItem value="electronics">패키지</MenuItem>
                  <MenuItem value="fashion">병원만</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <DropZone title="카테고리 이미지를 업로드해주세요." onChange={files => handleChangeDropZone(files)} />

                <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                  {files.map((file, index) => {
                return <UploadImageBox key={index}>
                        <BazaarImage src={file.preview} width="100%" />
                        <StyledClear onClick={handleFileDelete(file)} />
                      </UploadImageBox>;
              })}
                </FlexBox>
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControlLabel label="추천 카테고리" control={<Checkbox color="info" name="featured" onBlur={handleBlur} onChange={handleChange} value={values.featured} />} />
              </Grid>

              {/* <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  color="info"
                  size="medium"
                  type="number"
                  name="sale_price"
                  label="Sale Price"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Sale Price"
                  value={values.sale_price}
                  error={!!touched.sale_price && !!errors.sale_price}
                  helperText={(touched.sale_price && errors.sale_price) as string}
                />
               </Grid> */}

              <Grid item xs={12}>
                <Button variant="contained" color="info" type="submit">
                  저장
                </Button>
              </Grid>
            </Grid>
          </form>}
      </Formik>
    </Card>;
};
export default CategoryForm;