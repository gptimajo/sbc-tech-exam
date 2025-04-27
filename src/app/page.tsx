"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectSearch } from "../../slices/searchSlice";
import { fetchRecipes, clearRecipes, selectRecipes, selectRecipesLoading, selectRecipesError } from "../../slices/recipesSlice";
import { AppDispatch } from "../../store/store";

import { CircularProgress, List, Grid, Card, CardMedia, CardHeader, CardContent, Select, MenuItem, SelectChangeEvent, FormGroup, FormControlLabel, Checkbox, Fab, CardActionArea, styled } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
};

export default function Home() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectRecipesLoading);
  const error = useSelector(selectRecipesError);
  const search = useSelector(selectSearch);

  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [sortedRecipes, setSortedRecipes] = useState(recipes);

  console.log({recipes, loading, error})

  const clearAllRecipes = useCallback(() => dispatch(clearRecipes()),[dispatch]);

  const fetchAllRecipes = useCallback(async () => {
    clearAllRecipes();
    dispatch(fetchRecipes(search));
  }, [clearAllRecipes, dispatch, search]);

  useEffect(() => {
    fetchAllRecipes();
    return () => {
      clearAllRecipes();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    fetchAllRecipes();
  }, [fetchAllRecipes, search]);

  useEffect(() => {
    if (recipes) {
      setSortedRecipes([...recipes].sort((a, b) => {
        if(sortOrder === SortOrder.ASC) {
          return a.title < b.title ? -1 : 1;
        }
        if(sortOrder === SortOrder.DESC) {
          return a.title > b.title ? -1 : 1;
        }
        return 0;
      }));
    }
  },[recipes, sortOrder]);

  const handleChange = (event: SelectChangeEvent<SortOrder>) => {
    setSortOrder(event.target.value as SortOrder);
  };

  return (<Grid container spacing={2} style={{padding: '10px'}}>
    <Grid size={3}>
      <Sidebar>
        <SidebarItem>
          <SidebarItemHeader>Sort by Title</SidebarItemHeader>
          <Select onChange={handleChange} value={sortOrder}>
            <MenuItem value={SortOrder.ASC}>ASC</MenuItem>
            <MenuItem value={SortOrder.DESC}>DESC</MenuItem>
          </Select>
        </SidebarItem>
        <SidebarItem>
          <SidebarItemHeader>Filter</SidebarItemHeader>
          <Card>
            <CardHeader>Favorites</CardHeader>
            <CardContent>
              <FormGroup>
              <FormControlLabel control={<Checkbox value="Yes" />} label="Yes" />
              <FormControlLabel control={<Checkbox value="No" />} label="No" />
              </FormGroup>
            </CardContent>
          </Card>
        </SidebarItem>
      </Sidebar>
    </Grid>
    <Grid size={9} style={{position: 'relative'}}>
      <Fab color="primary" style={{ position: 'fixed', top: '80px', right: '5px', }} onClick={() => router.push('/recipe/new')}><AddIcon /></Fab>
      {error && <ErrorCard>No Record Found</ErrorCard>}
      {loading && <CircularProgress />}
      {!loading && (
        <ListCard>
          <List>
            {sortedRecipes.map((recipe) => (
              <ItemCard key={recipe.id}>
                <CardActionArea onClick={() => router.push(`/recipe/${recipe.id}`)}>
                  <Grid container>
                    <Grid size={4}><CardMedia sx={{height:260}} component="img" src={recipe.image} style={{borderRadius:'10px'}} /></Grid>
                    <Grid size={8} sx={{p:2}}>
                      <CardHeader title={recipe.title} sx={{p:0}} style={{textTransform:'capitalize'}} />
                      <CardContent sx={{p:0}}>
                        <Grid container>
                        <Grid size={12} sx={{pb:2}}>
                          {recipe.description}
                        </Grid>
                        <Grid size={6}>
                          Added by: {recipe.name}
                        </Grid>
                        <Grid size={6} style={{textAlign: 'right'}}>
                          Date: {new Date(recipe.createdAt).toLocaleDateString()}
                        </Grid>
                        </Grid>
                      </CardContent>
                    </Grid>
                  </Grid>
                </CardActionArea>
              </ItemCard>
            ))}
          </List>
        </ListCard>)}
    </Grid>
  </Grid>);
}

const Sidebar = styled('div')(() => ({
  width: '100%',
  maxWidth: '350px',
  margin: '0 auto',
}));

const SidebarItem = styled('div')(() => ({
  marginBottom: '10px',
}));

const SidebarItemHeader = styled('h3')(() => ({
  fontWeight: 'bold',
}));

const ListCard = styled(Card)(() => ({
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  padding: '10px',
  overflowX: 'hidden',
  overflowY: 'auto',
  maxHeight: `calc(95vh - 80px)`,
}));

const ItemCard = styled(Card)(() => ({
  margin: '10px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  color: '#000000',
  maxHeight: '260px'
}));

const ErrorCard = styled(Card)(() => ({
  height: `calc(90vh - 80px)`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '32px',
}));