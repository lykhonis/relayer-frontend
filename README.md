# Relayer Service

## Development

```shell
NEXT_PUBLIC_NETWORK_RPC_ENDPOINT=https://rpc.l16.lukso.network

RELAYER_ACCOUNT=0x...

DATABASE_URL=...
DATABASE_KEY=...
```

#### Database

```shell
supabase start
```

Reset:
```shell
supabase db reset
```

Generate types:
```shell
yarn db:generate-types
```

#### Execute Transaction

```shell
curl --header 'Content-Type: application/json' --request POST --data '{"keyManagerAddress":"0xBB645D97B0c7D101ca0d73131e521fe89B463BFD","transaction":{"abi":"0x7f23690c5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000596f357c6aa5a21984a83b7eef4cb0720ac1fcf5a45e9d84c653d97b71bbe89b7a728c386a697066733a2f2f516d624b43744b4d7573376741524470617744687a32506a4e36616f64346b69794e436851726d3451437858454b00000000000000","signature":"0x43c958b1729586749169599d7e776f18afc6223c7da21107161477d291d497973b4fc50a724b1b2ab98f3f8cf1d5cdbbbdf3512e4fbfbdc39732229a15beb14a1b","nonce":1}}' 'http://localhost:3000/api/execute'
```

#### Check Transaction Status

```shell
curl --request GET 'http://localhost:3000/api/task/149c1b23-e85b-4f51-a314-34c2bec71770'
```

#### Fetch Transactions

```shell
curl --request GET 'http://localhost:3000/api/transactions?keyManager=0xBB645D97B0c7D101ca0d73131e521fe89B463BFD'
curl --request GET 'http://localhost:3000/api/transactions?profile=0x506Fb98634903CaaC59E2e02b955E13CaC0E3cBF'
```
