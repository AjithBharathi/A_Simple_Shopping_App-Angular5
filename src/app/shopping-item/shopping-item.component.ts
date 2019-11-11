import { Component, OnInit } from '@angular/core';
import { Item } from '../item';
import { DataService } from '../data.service';

@Component({
  selector: 'app-shopping-item',
  templateUrl: './shopping-item.component.html',
  styleUrls: ['./shopping-item.component.css']
})
export class ShoppingItemComponent implements OnInit {
  
  // this is property
  shoppingItemList: Item[] = [];
  selectedItem: Item;
  toogleForm: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getItems();
  }

  getItems(){
    this.dataService.getShoppingItems()
    .subscribe(items => {
      this.shoppingItemList = items;
      console.log('data from dataservice: '  + this.shoppingItemList[0].itemName);
    });
  }
  addItem(form){
    // console.log(form.value)
    let newItem: Item = {
      itemName: form.value.itemName,
      itemQuantity: form.value.itemQuantity,
      itemBought: false
    }
    this.dataService.addShoppingItem(newItem)
      .subscribe(item =>{
        console.log(item);
        this.getItems();
      })
  }

  deleteItem(id){
      this.dataService.deleteShoppingItem(id)
      .subscribe( data => {
        console.log(data);
        if(data.n == 1){
          for(var i=0; i<this.shoppingItemList.length; i++){
            if(id == this.shoppingItemList[i]._id){
              this.shoppingItemList.splice(i, 1);
            }
          }
        }
      })
  }

  editItem(form){
    let newItem: Item = {
      _id: this.selectedItem._id,
      itemName: form.value.itemName,
      itemQuantity: form.value.itemQuantity,
      itemBought: this.selectedItem.itemBought
    }
    this.dataService.updateShoppingItem(newItem)
      .subscribe(result =>{
        console.log("original item updated with the old values: "+result.itemQuantity);
        this.getItems();
      });
      this.toogleForm = !this.toogleForm;
  }

  showEditForm(item){
    this.selectedItem = item;
    this.toogleForm = !this.toogleForm;
  }

  updateItemCheckbox(item){
    item.itemBought = !item.itemBought;
    this.dataService.updateShoppingItem(item)
      .subscribe(result =>{
        console.log("original checkbox value: "+result.itemBought);
        this.getItems();
      });

  }
}
