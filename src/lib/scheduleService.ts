import scheduleData from '../../schedule.json'

// Интерфейсы для работы с данными расписания
export interface ScheduleTimeSlot {
  day: string
  time: string | string[]
}

export interface TrainerSchedule {
  name: string
  schedule: Record<string, string | string[]>
  photo?: string
}

export interface GroupProgram {
  name: string
  schedule: Record<string, string | string[]>
}

export interface ClubSchedule {
  ГРУППОВЫЕ_ТРЕНИРОВКИ: Record<string, Record<string, string | string[]>>
  ИНДИВИДУАЛЬНЫЕ_ТРЕНИРОВКИ: Record<string, Record<string, string | string[]>>
}

// Типы для филиалов
type BranchName = 'МИРА' | 'ПИОНЕРСКАЯ'

// Функция для получения расписания тренеров для конкретного филиала
export function getTrainersSchedule(branch: BranchName): TrainerSchedule[] {
  const branchData = scheduleData.ФИЛИАЛЫ[branch]
  if (!branchData || !branchData.ИНДИВИДУАЛЬНЫЕ_ТРЕНИРОВКИ) {
    return []
  }

  return Object.entries(branchData.ИНДИВИДУАЛЬНЫЕ_ТРЕНИРОВКИ).map(([name, schedule]) => ({
    name,
    schedule
  }))
}

// Функция для получения групповых программ для конкретного филиала
export function getGroupPrograms(branch: BranchName): GroupProgram[] {
  const branchData = scheduleData.ФИЛИАЛЫ[branch]
  if (!branchData || !branchData.ГРУППОВЫЕ_ТРЕНИРОВКИ) {
    return []
  }

  return Object.entries(branchData.ГРУППОВЫЕ_ТРЕНИРОВКИ).map(([name, schedule]) => ({
    name,
    schedule
  }))
}

// Функция для преобразования расписания в читаемый формат
export function formatSchedule(schedule: Record<string, string | string[]>): string[] {
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
  const formattedSchedule: string[] = []

  days.forEach(day => {
    const timeSlot = schedule[day]
    if (timeSlot) {
      if (Array.isArray(timeSlot)) {
        timeSlot.forEach(time => {
          formattedSchedule.push(`${day}: ${time}`)
        })
      } else {
        formattedSchedule.push(`${day}: ${timeSlot}`)
      }
    }
  })

  return formattedSchedule
}

// Функция для получения расписания конкретного тренера
export function getTrainerSchedule(branch: BranchName, trainerName: string): string[] {
  const trainers = getTrainersSchedule(branch)
  const trainer = trainers.find(t => t.name === trainerName)
  
  if (!trainer) {
    return []
  }

  return formatSchedule(trainer.schedule)
}

// Функция для получения расписания конкретной групповой программы
export function getGroupProgramSchedule(branch: BranchName, programName: string): string[] {
  const programs = getGroupPrograms(branch)
  const program = programs.find(p => p.name === programName)
  
  if (!program) {
    return []
  }

  return formatSchedule(program.schedule)
}

// Функция для получения всех доступных филиалов
export function getAvailableBranches(): BranchName[] {
  return Object.keys(scheduleData.ФИЛИАЛЫ) as BranchName[]
}

// Функция для сопоставления ID клуба с названием филиала
export function mapClubIdToBranch(clubId: string): BranchName | null {
  const mapping: Record<string, BranchName> = {
    'mira': 'МИРА',
    'pionerskaya': 'ПИОНЕРСКАЯ'
  }
  
  return mapping[clubId] || null
}

// Маппинг имен тренеров к их фотографиям
const trainerPhotoMapping: Record<string, string> = {
  'АГАНИНА ЮЛИЯ': '/images/trainers/aganina_yulia.jpeg',
  'ДАТЛЫ РУСЛАН': '/images/trainers/datly_ruslan.jpeg',
  'ОСАДЧАЯ ГАЛИНА': '/images/trainers/osadchaya_galina.jpeg',
  'ПИРОВ АХМАД': '/images/trainers/pirov_ahmad.jpeg',
  'ПОГОСЯН ВЯЧЕСЛАВ': '/images/trainers/pogosyan_vyacheslav.jpeg',
  'ПОЛЕТАЕВА ЕЛЕНА': '/images/trainers/poletaeva_elena.jpeg',
  'СИМОНОВА ВЕРОНИКА': '/images/trainers/simonova_veronika.jpeg',
  'ТУЖИЛИН ВИТАЛИЙ': '/images/trainers/tuzhilin_vitaliy.jpeg',
  'ЧЕРТКОВ ЛЕОНИД': '/images/trainers/chertkov_leonid.jpeg',
  'ЧЕЧЕЛЬ МАРИЯ': '/images/trainers/chechel.jpeg'
}

// Функция для получения фото тренера
export function getTrainerPhoto(trainerName: string): string {
  return trainerPhotoMapping[trainerName] || '/images/trainers/no.png'
}

// Функция для получения тренеров с фотографиями
export function getTrainersWithPhotos(branch: BranchName): TrainerSchedule[] {
  const trainers = getTrainersSchedule(branch)
  return trainers.map(trainer => ({
    ...trainer,
    photo: getTrainerPhoto(trainer.name)
  }))
}
