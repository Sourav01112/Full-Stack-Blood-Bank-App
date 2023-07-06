import React, { useState } from "react";
import InventoryForm from "./InventoryForm";
import { Button } from "antd";

export const Inventory = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-end">
        <Button type="default" onClick={() => setOpen(true)}>
          Add Inventory
        </Button>
      </div>
      {open && <InventoryForm open={open} setOpen={setOpen} />}
    </div>
  );
};
