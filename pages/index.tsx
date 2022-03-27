import type { NextPage } from 'next'
import React from 'react'

const PersonCard = ({ name, locationIdx }: { name: string; locationIdx: number }) => {
	const onDrag = (person: Person) => {
		return (e: React.DragEvent) => {
			e.dataTransfer.setData('text', JSON.stringify({ ...person, locationIdx: locationIdx }))
		}
	}

	return (
		<div className="card" onDragStart={onDrag({ name: name })} draggable={true}>
			{name}
		</div>
	)
}

type Person = {
	name: string
}

type Location = {
	name: string
	persons: Person[]
}

type Board = {
	hospital: Location
	shrine: Location
	town: Location
	school: Location
}

type BoardProps = {
	board: Board
}

const Home: NextPage<BoardProps> = ({ board }: BoardProps) => {
	const [locations, setLocations] = React.useState([board.hospital, board.shrine, board.town, board.school])
	const onDrop = (locationIdx: number) => {
		return (event: React.DragEvent<HTMLTableDataCellElement>) => {
			event.preventDefault()
			const jsStr = event.dataTransfer.getData('text')
			const person = JSON.parse(jsStr) as { name: string; locationIdx: number }
			const idx = locations[person.locationIdx].persons.findIndex((pp) => pp.name === person.name)
			if (idx !== -1) {
				locations[person.locationIdx].persons.splice(idx, 1)
				locations[locationIdx].persons.push({ name: person.name })
				setLocations([...locations])
			}
		}
	}
	const allowDrop = (event: React.DragEvent<HTMLTableDataCellElement>) => {
		event.preventDefault()
	}

	return (
		<div>
			<table>
				<tr>
					<td onDrop={onDrop(0)} onDragOver={allowDrop} style={{ width: 300, height: 300 }}>
						<p>{locations[0].name}</p>
						{locations[0].persons.map((pp, ii) => {
							return <PersonCard key={ii} name={pp.name} locationIdx={0} />
						})}
					</td>
					<td onDrop={onDrop(1)} onDragOver={allowDrop}>
						<p>{locations[1].name}</p>
						{locations[1].persons.map((pp, ii) => {
							return <PersonCard key={ii} name={pp.name} locationIdx={1} />
						})}
					</td>
				</tr>
				<tr>
					<td onDrop={onDrop(2)} onDragOver={allowDrop}>
						<p>{locations[2].name}</p>
						{locations[2].persons.map((pp, ii) => {
							return <PersonCard key={ii} name={pp.name} locationIdx={2} />
						})}
					</td>
					<td onDrop={onDrop(3)} onDragOver={allowDrop}>
						<p>{locations[3].name}</p>
						{locations[3].persons.map((pp, ii) => {
							return <PersonCard key={ii} name={pp.name} locationIdx={3} />
						})}
					</td>
				</tr>
			</table>
		</div>
	)
}

export default Home

export async function getServerSideProps(): Promise<{
	props: BoardProps
}> {
	return {
		props: {
			board: {
				hospital: {
					name: '병원',
					persons: [{ name: '간호사' }],
				},
				shrine: {
					name: '신사',
					persons: [{ name: '무녀' }],
				},
				town: {
					name: '도시',
					persons: [{ name: '회사원' }],
				},
				school: {
					name: '학교',
					persons: [{ name: '아이돌' }],
				},
			},
		},
	}
}
