import {useQuery,gql} from "@apollo/client"
//可以在thegraph上写好graphql之后复制过来，这里就是graphql的语句
const GET_ACTIVE_ITEM=gql`
{
  activeItems(first: 5,where:{buyer:"0x0000000000000000000000000000000000000000"}) {
    id
    buyer
    seller
    nftAddress
    tokenId
    price
  }
}
`

export default function GraphExample(){
    const {loading,error,data}=useQuery(GET_ACTIVE_ITEM)
    console.log(data)
    return <div>hi</div>
}