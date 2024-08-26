import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { getInStockItems } from "./action";
import { SearchableTable } from "@/components/SearchableTable";

type Item = Awaited<ReturnType<typeof getInStockItems>>["values"][0];

type ItemListProps = {
  filter?: string;
  onAddItem: (itemToAdd: Item) => void;
  onRemoveItem: (itemToRemove: Item) => void;
};

export default function ItemsList({ onAddItem, onRemoveItem }: ItemListProps) {
    const actionButtonsRenderer = (item: Item) => (
        <ButtonGroup variant="contained" aria-label="actions">
            <Button onClick={() => onRemoveItem(item)}>
                <Remove />
            </Button>
            <Button onClick={() => onAddItem(item)}>
                <Add />
            </Button>
        </ButtonGroup>
    );

    return (
        <SearchableTable
            dataSource={getInStockItems}
            keys={["id", "description", "price", "stock"]}
            additionalColumns={[["actions", actionButtonsRenderer]]}
        />
    );
}
