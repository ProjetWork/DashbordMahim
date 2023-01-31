<template>
    <div class=" container" >
        <div class="row d-flex justify-content-center">
            <div class="col-md-4 " >
                <input type="text" placeholder="le code Id" class="form-control" v-model="recherche">
            </div>
        </div>
    </div>
    <table class="table table-striped ">
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">Info U</th>
      <th scope="col">Livraison</th>
      <th scope="col">totales</th>
      <th scope="col">Info Prod</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="data in serche">
      <th scope="row">{{ new Date(data.time.seconds*1000).toLocaleDateString('fr') }}</th>
      <td>
        CodeId : <strong>{{ data.userid }} </strong> <br>
        nom : <strong>{{ data.nom }} </strong> <br>
        contact : <strong> {{ data.contact }} </strong> <br>
        email : <strong> {{ data.email }} </strong>
      </td>
      <td>
        Lieu precis : <strong> {{ data.livraison.LivreAdress }} </strong>  <br>
        Adresse : <strong> {{ data.livraison.commune }} </strong>  <br>
        date : <strong> {{  data.livraison.date }} </strong>  <br>
        heure : <strong>{{  data.livraison.heure }} </strong> <br>
        prix : <strong> {{  data.livraison.prix }} </strong>  <br>
      </td>
      <td>
        avec code promo : <strong> {{ data.couponCode }}  </strong> <br>
        total : <strong> {{ data.total }}  </strong>  <br> 
        Grand total : <strong> {{ data.grandtotal }} </strong>
      </td>
      <td>
        <div v-for="P in data.products">
            nom : <strong> {{ P.product_name }} </strong> <br>
            FourName : <strong> {{ P.FourName }} </strong> <br>
            prix : <strong> {{ P.sales_price }} </strong> <br>
            qty : <strong> {{ P.qty }} </strong> 
            <hr>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</template>
<script>
import { collection, getFirestore, onSnapshot } from '@firebase/firestore';
import { defineComponent } from 'vue';
import app from '../../fi';

 export default defineComponent({
     data(){
        return {
            Data:[],
            recherche :''
        }
     },
   async  created(){
    const db = getFirestore(app)
    onSnapshot(collection(db,"COMMANDES" ),(data)=>{
        this.Data=[]
        data.forEach((element)=>{
            let take = element.data()
            take.t = new Date(take.time.seconds*1000)
            this.Data.push(take)
        })
    this.Data = this.Data.sort((a,b)=> b.t - a.t)
    })
   },
  computed : {
    serche(){
        if(this.recherche){
          return this.Data.filter(e=> e.ID == this.recherche)
        }else{
            return this.Data 
        }
    }
  }
 })
</script>