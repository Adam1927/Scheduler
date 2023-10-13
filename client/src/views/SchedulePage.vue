<template>
  <div>
    <div
        class="title"
        style="font-size: 2rem; color: #fff; margin-top: 10px">
        Schedule
    </div>
    <div style="margin: 2%">
      <table class="stripped hover table table-dark">
        <thead style="background-color: ##0f817a">
          <tr>
            <th v-for="day in days" :key="day">{{ day.toDateString() }}</th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <td
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              @click="handleCellClick(rowIndex, cellIndex)"
              :class="{ 'bg-danger' : isCellSelected(rowIndex, cellIndex) }"
            >
              {{ cell.text }}
            </td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="btn btn-info" @click="saveEvents()">Save</button>
    </div>
  </div>
</template>

<script>
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
// import { Api } from '@/Api'

export default {
  mounted() {
    this.fillTable()
    document.body.style.backgroundColor = '#232526'
  },
  data() {
    return {
      days: [],
      tableData: [],
      selectedCells: []
    }
  },
  methods: {
    fillTable() {
      var table = [[]]
      const startDay = startOfWeek(new Date(), { weekStartsOn: 1 })
      const endDay = endOfWeek(new Date(), { weekStartsOn: 1 })
      this.days = eachDayOfInterval({ start: startDay, end: endDay }).slice(0, 5)
      for (let i = 0; i < 8; i++) {
        var currentArray = []

        for (let j = 0; j < 5; j++) {
          const startTime = 9
          var cellText = (startTime + i) + ':00-' + (startTime + i + 1) + ':00'
          currentArray.push({
            date: this.days[j],
            text: cellText
          })
        }
        table[i] = currentArray
      }
      this.tableData = table
      console.log(this.tableData)
    },
    handleCellClick(rowIndex, cellIndex) {
      const cellKey = `${rowIndex}-${cellIndex}`
      if (!this.isCellSelected(rowIndex, cellIndex)) {
        this.selectedCells.push(cellKey)
      } else {
        // Deselect the cell if it's already selected
        this.selectedCells = this.selectedCells.filter((cell) => cell !== cellKey)
      }
    },
    isCellSelected(rowIndex, cellIndex) {
      return this.selectedCells.includes(`${rowIndex}-${cellIndex}`)
    },
    saveEvents() {
      for (const selectedCell in this.selectedCells) {
        // to implement
        console.log(selectedCell)
      }
    }
  }
}

</script>
